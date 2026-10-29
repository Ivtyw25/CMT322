#!/usr/bin/env node
// PreToolUse hook for Bash. It backs up the deny rules in .claude/settings.json
// with the checks that prefix rules can't express:
//
//   deny  git push --force / -f / --force-with-lease / --mirror / +refspec
//   deny  git reset --hard while on main (or when the branch can't be told)
//   deny  recursive rm (or find -delete) on a path outside the repo and
//         ../mutiara-wt, or on a path that can't be resolved ($VAR, $(...))
//   deny  commands that print or upload secrets
//   ask   rm, cp, mv, mkdir, ls, cat on a path outside the repo and ../mutiara-wt
//
// Anything else falls through to the normal permission rules.

import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import path from 'node:path';

let input = {};
try { input = JSON.parse(readFileSync(0, 'utf8')); } catch {}
const command = input?.tool_input?.command;
if (typeof command !== 'string') process.exit(0);

const win = process.platform === 'win32';
const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const roots = [root, path.resolve(root, '../mutiara-wt')].map(norm);

const SECRET_VAR = /\$\{?[A-Za-z_]*(TOKEN|SECRET|PASSWORD|PASSWD|API_?KEY|PRIVATE_?KEY|CREDENTIAL)[A-Za-z0-9_]*/i;
const SECRET_PATH = /(^|[\\/])(\.env(\.(?!example$)[\w.-]+)?|\.npmrc|\.netrc|\.git-credentials|id_(rsa|ed25519|ecdsa|dsa)\w*|[^\\/]+\.(pem|p12|pfx|key))$|(^|[\\/])\.ssh([\\/]|$)|com\.vercel\.cli|[\\/]GitHub CLI([\\/]|$)|\.credentials\.json$/i;
const CONTENT_READERS = new Set(['cat', 'head', 'tail', 'less', 'more', 'bat', 'type', 'base64', 'xxd', 'od', 'hexdump', 'strings', 'grep', 'rg', 'sed', 'awk', 'cp', 'mv', 'scp', 'rsync', 'tar', 'zip', 'curl', 'wget', 'gh']);
const PATH_CHECKED = new Set(['rm', 'cp', 'mv', 'mkdir', 'ls', 'cat']);
const WRAPPERS = new Set(['command', 'builtin', 'exec', 'nohup', 'time', 'nice', 'sudo', 'npx', 'then', 'do', 'else', 'if', 'while', 'until', '!', '{', '}']);
const REDIRECT = /^\d*(>>?|<|&>)/;

const asks = [];
check(command, { dir: input.cwd || root, checkout: false });
if (asks.length) decide('ask', asks.join('; '));
process.exit(0);

function decide(decision, reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: decision, permissionDecisionReason: `guard-bash: ${reason}` },
  }));
  process.exit(0);
}

function toNative(p) {
  if (p === '~' || p.startsWith('~/')) p = homedir() + p.slice(1);
  const m = win && /^\/(?:cygdrive\/)?([a-zA-Z])(?=\/|$)/.exec(p);
  if (m) p = `${m[1]}:${p.slice(m[0].length) || '/'}`;
  return p;
}

function norm(p) {
  const r = path.resolve(p);
  return win ? r.toLowerCase() : r;
}

// Resolves a word to an absolute path, or null if it can't be known statically.
// For globs, the literal directory before the first wildcard is used.
function where(word, dir) {
  if (word.dynamic) return null;
  let t = word.text;
  const g = t.search(/[*?[]/);
  if (g !== -1) {
    const cut = Math.max(t.lastIndexOf('/', g), t.lastIndexOf('\\', g));
    t = cut === -1 ? '.' : t.slice(0, cut) || '/';
  }
  t = toNative(t);
  if (dir === null && !path.isAbsolute(t)) return null;
  return norm(path.resolve(dir ?? root, t));
}

function within(p) {
  return roots.some((r) => p.startsWith(r + path.sep));
}

function withinOrAt(p) {
  return roots.some((r) => p === r || p.startsWith(r + path.sep));
}

// Splits a command line into segments of words, honouring quotes. ;, &&, ||,
// |, & and newlines end a segment. A word is "dynamic" if it holds $ or a
// backtick outside single quotes.
function parse(line) {
  const segments = [];
  let words = [], word = '', dynamic = false, inWord = false, quote = null;
  const endWord = () => { if (inWord) words.push({ text: word, dynamic }); word = ''; dynamic = false; inWord = false; };
  const endSegment = () => { endWord(); if (words.length) segments.push(words); words = []; };
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote === "'") { if (c === "'") quote = null; else word += c; continue; }
    if (quote === '"') {
      if (c === '"') quote = null;
      else if (c === '\\' && '$`"\\\n'.includes(line[i + 1] ?? '')) word += line[++i];
      else { if (c === '$' || c === '`') dynamic = true; word += c; }
      continue;
    }
    if (c === "'" || c === '"') { quote = c; inWord = true; continue; }
    if (c === '\\' && i + 1 < line.length) { word += line[++i]; inWord = true; continue; }
    if (c === ' ' || c === '\t' || c === '\r') { endWord(); continue; }
    if (c === '&' && (line[i - 1] === '>' || line[i + 1] === '>')) { word += c; inWord = true; continue; }
    if (c === '\n' || c === ';' || c === '|' || c === '&') { endSegment(); continue; }
    if (c === '$' || c === '`') dynamic = true;
    word += c; inWord = true;
  }
  endSegment();
  return segments;
}

// Positional words, without redirections and their targets.
function operands(args) {
  const out = [];
  for (let i = 0; i < args.length; i++) {
    const t = args[i].text;
    if (REDIRECT.test(t)) { if (/^\d*(>>?|<|&>)$/.test(t)) i++; continue; }
    if (t === '/dev/null' || t.toLowerCase() === 'nul') continue;
    out.push(args[i]);
  }
  return out;
}

function currentBranch(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'symbolic-ref', '--short', '-q', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null;
  } catch {
    return null;
  }
}

function check(line, state) {
  for (const segment of parse(line)) checkSegment(segment, state);
}

function checkSegment(segment, state) {
  const w = segment.map((x) => ({ ...x }));
  w[0].text = w[0].text.replace(/^\(+/, '');
  w[w.length - 1].text = w[w.length - 1].text.replace(/\)+$/, '');

  let sawEnv = false;
  while (w.length) {
    const t = w[0].text;
    if (t === 'env') { sawEnv = true; w.shift(); continue; }
    if (WRAPPERS.has(t) || t === '' || t.startsWith('-') || /^[A-Za-z_]\w*=/.test(t)) { w.shift(); continue; }
    break;
  }
  if (!w.length) {
    if (sawEnv) decide('deny', 'env with no command prints every environment variable, including secrets');
    return;
  }

  const cmd = path.basename(toNative(w[0].text)).replace(/\.exe$/i, '').toLowerCase();
  const args = w.slice(1);
  const ops = operands(args);
  const pos = ops.filter((x) => !x.text.startsWith('-')).map((x) => x.text);

  for (const x of w) {
    if (x.dynamic && SECRET_VAR.test(x.text)) decide('deny', `references a secret-looking variable (${x.text})`);
    if (/process\.env(?![.\w])|process\.env\.\w*(TOKEN|SECRET|PASSWORD|API_?KEY|PRIVATE)/i.test(x.text)) decide('deny', 'prints process.env secrets');
  }
  if (CONTENT_READERS.has(cmd)) {
    const hit = args.find((x) => SECRET_PATH.test(toNative(x.text)));
    if (hit) decide('deny', `reads or sends a secrets file (${hit.text})`);
  }

  switch (cmd) {
    case 'bash': case 'sh': case 'zsh': case 'dash': {
      const i = args.findIndex((x) => x.text === '-c');
      if (i !== -1 && args[i + 1]) check(args[i + 1].text, { ...state });
      return;
    }
    case 'eval':
      check(args.map((x) => x.text).join(' '), { ...state });
      return;
    case 'xargs': {
      const i = args.findIndex((x) => PATH_CHECKED.has(path.basename(x.text)));
      if (i !== -1) checkSegment([...args.slice(i), { text: 'xargs-input', dynamic: true }], state);
      return;
    }
    case 'cd': case 'pushd':
      state.dir = pos.length === 0 ? homedir() : pos[0] === '-' ? null : where(ops.find((x) => !x.text.startsWith('-')), state.dir);
      return;
    case 'printenv':
      return decide('deny', 'printenv prints environment variables, including secrets');
    case 'set':
      if (args.length === 0) decide('deny', 'set with no arguments prints every shell variable');
      return;
    case 'export': case 'declare': case 'typeset':
      if (args.every((x) => /^-[px]+$/.test(x.text))) decide('deny', `${cmd} with no names prints every exported variable`);
      return;
    case 'rm':
      return checkRm(ops, state);
    case 'find':
      return checkFind(args, state);
    case 'git':
      return checkGit(args, state);
    case 'gh': {
      const [a, b] = pos;
      if (a === 'auth' && (b === 'token' || args.some((x) => x.text === '-t' || x.text === '--show-token'))) decide('deny', 'prints the GitHub token');
      if (a === 'secret') decide('deny', 'gh secret reads or uploads secrets');
      if (a === 'gist' && b === 'create') decide('deny', 'gh gist create uploads files to a public service');
      return;
    }
    case 'vercel': case 'vc': {
      const k = pos.findIndex((p) => ['env', 'pull', 'remove', 'rm', 'project', 'projects'].includes(p));
      const [a, b] = k === -1 ? [] : pos.slice(k);
      if (a === 'env' && (b === 'pull' || b === 'add')) decide('deny', `vercel env ${b} downloads or uploads secrets`);
      if (a === 'pull') decide('deny', 'vercel pull downloads environment secrets');
      if (a === 'remove' || a === 'rm') decide('deny', 'vercel remove deletes deployments');
      if ((a === 'project' || a === 'projects') && (b === 'rm' || b === 'remove')) decide('deny', 'deletes the Vercel project');
      return;
    }
    case 'npm': {
      if (['token', 'publish', 'unpublish'].includes(pos[0])) decide('deny', `npm ${pos[0]} is not allowed in this build`);
      if (pos[0] === 'config' && pos[1] === 'get' && /auth|token|password/i.test(pos[2] ?? '')) decide('deny', 'prints an npm credential');
      return;
    }
    case 'curl': {
      const upload = args.some((x, i) => {
        const next = args[i + 1];
        if (['-T', '--upload-file', '-F', '--form'].includes(x.text) || /^-[TF]./.test(x.text)) return true;
        if (/^(-d|--data|--data-binary|--data-raw|--data-urlencode|--json)$/.test(x.text)) return !!next && (next.dynamic || next.text.startsWith('@'));
        return /^(-d|--data[\w-]*=)@/.test(x.text);
      });
      if (upload) decide('deny', 'curl uploads a file or variable');
      return;
    }
    case 'wget':
      if (args.some((x) => /^--(post|body)-file/.test(x.text))) decide('deny', 'wget uploads a file');
      return;
    default:
      if (PATH_CHECKED.has(cmd)) checkPaths(cmd, ops, state);
  }
}

function checkRm(ops, state) {
  let recursive = false, endOfOptions = false;
  const targets = [];
  for (const x of ops) {
    if (!endOfOptions && x.text === '--') { endOfOptions = true; continue; }
    if (!endOfOptions && x.text.startsWith('-') && x.text.length > 1) {
      if (x.text === '--recursive' || (!x.text.startsWith('--') && /[rR]/.test(x.text))) recursive = true;
      continue;
    }
    targets.push(x);
  }
  for (const t of targets) {
    const p = where(t, state.dir);
    if (recursive && (!p || !within(p))) decide('deny', `recursive rm outside the repo, or on a path that can't be resolved (${t.text}). Write the target as a literal path inside the repo or ../mutiara-wt.`);
    if (!recursive && (!p || !withinOrAt(p))) asks.push(`rm outside the repo (${t.text})`);
  }
}

function checkFind(args, state) {
  const deletes = args.some((x, i) => x.text === '-delete' || (/^-(exec|execdir|ok|okdir)$/.test(x.text) && path.basename(args[i + 1]?.text ?? '') === 'rm'));
  if (!deletes) return;
  const end = args.findIndex((x) => /^[-(!]/.test(x.text));
  const starts = args.slice(0, end === -1 ? args.length : end);
  for (const s of starts.length ? starts : [{ text: '.', dynamic: false }]) {
    const p = where(s, state.dir);
    if (!p || !withinOrAt(p)) decide('deny', `find that deletes files outside the repo (${s.text})`);
  }
}

function checkGit(args, state) {
  let i = 0, dir = state.dir, opaque = false;
  while (i < args.length && args[i].text.startsWith('-')) {
    const o = args[i].text;
    if (o === '-C') { dir = args[i + 1] ? where(args[i + 1], dir) : dir; i += 2; continue; }
    if (o === '-c') { i += 2; continue; }
    if (o.startsWith('--git-dir') || o.startsWith('--work-tree')) opaque = true;
    i++;
  }
  const sub = args[i]?.text;
  const rest = args.slice(i + 1).map((x) => x.text);

  if (sub === 'push') {
    const forced = rest.some((a) => a === '--force' || a.startsWith('--force-with-lease') || a === '--mirror' || (/^-[a-zA-Z]*f[a-zA-Z]*$/.test(a) && !a.startsWith('--')) || (a.startsWith('+') && a.length > 1));
    if (forced) decide('deny', 'force-pushing is not allowed (never rewrite pushed history)');
  }
  if (sub === 'reset' && rest.includes('--hard')) {
    const branch = opaque || state.checkout || dir === null ? null : currentBranch(dir);
    if (branch === null) decide('deny', "git reset --hard where the branch can't be told. Run it as `git -C <worktree> reset --hard` on the iteration branch.");
    if (branch === 'main') decide('deny', 'git reset --hard on main is not allowed');
  }
  if (sub === 'checkout' || sub === 'switch') state.checkout = true;
  if (sub && sub.startsWith('credential')) decide('deny', 'git credential commands print stored credentials');
}

function checkPaths(cmd, ops, state) {
  for (const x of ops) {
    if (x.text.startsWith('-')) continue;
    const p = where(x, state.dir);
    if (!p || !withinOrAt(p)) asks.push(`${cmd} outside the repo (${x.text})`);
  }
}
