// Runs one command quietly: full output goes to .logs/<label>.log, the console gets one status
// line plus a short failure excerpt. Agents read the excerpt, and the log only when they need it.
// Set VERBOSE=1 to stream everything instead.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LOG_DIR = '.logs';
const MAX_EXCERPT = 60;
const SIGNAL =
  /error|failed|✘|×|expected|received|timed? ?out|\d+ (passed|failed|flaky|skipped|did not run)|^\s+\d+\) /i;

function excerpt(output) {
  const lines = output.split(/\r?\n/).filter((l) => l.trim());
  const picked = lines.filter((l) => SIGNAL.test(l));
  const chosen = picked.length ? picked : lines.slice(-30);
  const shown = chosen.slice(0, MAX_EXCERPT);
  const more = chosen.length - shown.length;
  return shown.join('\n') + (more > 0 ? `\n… ${more} more matching lines in the log` : '');
}

/** @returns {number} exit status */
export function step(label, cmd, args, extraEnv = {}) {
  const env = { ...process.env, FORCE_COLOR: '0', ...extraEnv };
  const shell = process.platform === 'win32';
  if (env.VERBOSE === '1') {
    return spawnSync(cmd, args, { stdio: 'inherit', shell, env }).status ?? 1;
  }
  const r = spawnSync(cmd, args, { encoding: 'utf8', shell, env, maxBuffer: 256 * 1024 * 1024 });
  const output = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  mkdirSync(LOG_DIR, { recursive: true });
  const logFile = join(LOG_DIR, `${label.replace(/[^\w-]+/g, '-')}.log`);
  writeFileSync(logFile, output);
  const status = r.status ?? 1;
  if (status === 0) {
    const summary = output
      .split(/\r?\n/)
      .filter((l) => /\d+ (passed|failed|flaky|skipped)/.test(l));
    console.log(
      `✓ ${label}${summary.length ? ` (${summary.map((s) => s.trim()).join(', ')})` : ''}`,
    );
  } else {
    console.log(`✗ ${label}: full log in ${logFile}\n${excerpt(output)}`);
  }
  return status;
}
