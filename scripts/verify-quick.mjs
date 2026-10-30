// typecheck + lint + check:tokens + e2e for the pages being worked on (status in-progress or review).
// Quiet: one line per step, failure excerpts only, full logs in .logs/ (VERBOSE=1 to stream).
import { existsSync, readFileSync } from 'node:fs';
import { step } from './lib/step.mjs';

const run = (label, cmd, args) => {
  const status = step(label, cmd, args);
  if (status !== 0) process.exit(status);
};

run('typecheck', 'npm', ['run', 'typecheck']);
run('lint', 'npm', ['run', 'lint']);
run('check-tokens', 'npm', ['run', 'check:tokens']);

const { pages } = JSON.parse(readFileSync('pages.json', 'utf8'));
const specs = pages
  .filter((p) => p.status === 'in-progress' || p.status === 'review')
  .map((p) => `tests/e2e/${p.id}.spec.ts`)
  .filter((file) => existsSync(file));
run('quick-e2e', 'node', ['scripts/run-tests.mjs', 'e2e', 'tests/e2e/shared', ...specs]);
console.log('\nverify:quick passed');
