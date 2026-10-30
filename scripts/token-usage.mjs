// Usage: node scripts/token-usage.mjs [sessionId]
// Sums Claude token usage for one Claude Code session (main transcript + subagents).
// Defaults to the most recently modified session of this project.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const projectDir = join(homedir(), '.claude', 'projects', process.cwd().replace(/[:\\/]/g, '-'));
const sessions = readdirSync(projectDir)
  .filter((f) => f.endsWith('.jsonl'))
  .map((f) => ({ id: f.slice(0, -6), mtime: statSync(join(projectDir, f)).mtimeMs }))
  .sort((a, b) => b.mtime - a.mtime);
const sessionId = process.argv[2] ?? sessions[0]?.id;
if (!sessionId) throw new Error(`No sessions in ${projectDir}`);

function summarise(file) {
  const seen = new Set();
  const total = { calls: 0, fresh: 0, cacheWrite: 0, cacheRead: 0, output: 0, maxContext: 0 };
  let label = '';
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line) continue;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    const message = entry.message;
    if (!label && entry.type === 'user' && typeof message?.content === 'string') {
      label = message.content.replace(/\s+/g, ' ').slice(0, 48);
    }
    const usage = message?.usage;
    if (entry.type !== 'assistant' || !usage || seen.has(message.id)) continue;
    seen.add(message.id);
    const fresh = usage.input_tokens ?? 0;
    const cacheWrite = usage.cache_creation_input_tokens ?? 0;
    const cacheRead = usage.cache_read_input_tokens ?? 0;
    total.calls += 1;
    total.fresh += fresh;
    total.cacheWrite += cacheWrite;
    total.cacheRead += cacheRead;
    total.output += usage.output_tokens ?? 0;
    total.maxContext = Math.max(total.maxContext, fresh + cacheWrite + cacheRead);
  }
  return { label, ...total };
}

const rows = [{ name: 'main', ...summarise(join(projectDir, `${sessionId}.jsonl`)) }];
const subDir = join(projectDir, sessionId, 'subagents');
if (existsSync(subDir)) {
  for (const f of readdirSync(subDir).filter((f) => f.endsWith('.jsonl'))) {
    rows.push({ name: f.replace(/^agent-|\.jsonl$/g, ''), ...summarise(join(subDir, f)) });
  }
}

const k = (n) => `${(n / 1000).toFixed(0)}k`;
console.log(`Session ${sessionId}`);
console.log(
  'agent | calls | cache read | cache write | fresh in | output | max context | first prompt',
);
for (const r of rows.sort((a, b) => b.cacheRead - a.cacheRead)) {
  console.log(
    [
      r.name,
      r.calls,
      k(r.cacheRead),
      k(r.cacheWrite),
      k(r.fresh),
      k(r.output),
      k(r.maxContext),
      r.label,
    ].join(' | '),
  );
}
const sum = (key) => rows.reduce((s, r) => s + r[key], 0);
console.log(
  `TOTAL | ${sum('calls')} | ${k(sum('cacheRead'))} | ${k(sum('cacheWrite'))} | ${k(sum('fresh'))} | ${k(sum('output'))}`,
);
