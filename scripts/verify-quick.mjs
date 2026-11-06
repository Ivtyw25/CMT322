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
// Some groups keep their behavior coverage in one suite rather than one file per page.
const specs = [
  ...new Set(
    pages
      .filter((p) => p.status === 'in-progress' || p.status === 'review')
      .flatMap((p) => [`tests/e2e/${p.id}.spec.ts`, `tests/e2e/${p.group}.spec.ts`])
      .filter((file) => existsSync(file)),
  ),
];
run('quick-e2e', 'node', [
  'scripts/run-tests.mjs',
  'e2e',
  'tests/e2e/shared',
  ...specs,
  '--workers=2',
]);
console.log('\nverify:quick passed');
