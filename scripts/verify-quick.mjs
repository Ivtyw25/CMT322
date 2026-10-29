// typecheck + lint + check:tokens + e2e for the pages being worked on (status in-progress or review).
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const run = (cmd, args) => {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run('npm', ['run', 'typecheck']);
run('npm', ['run', 'lint']);
run('npm', ['run', 'check:tokens']);

const { pages } = JSON.parse(readFileSync('pages.json', 'utf8'));
const specs = pages
  .filter((p) => p.status === 'in-progress' || p.status === 'review')
  .map((p) => `tests/e2e/${p.id}.spec.ts`)
  .filter((file) => existsSync(file));
run('node', ['scripts/run-tests.mjs', 'e2e', 'tests/e2e/shared', ...specs]);
