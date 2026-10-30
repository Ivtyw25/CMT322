// Usage: node scripts/run-tests.mjs <project> [--base-url <url>] [extra playwright args]
// Quiet by default (see scripts/lib/step.mjs); VERBOSE=1 streams the full Playwright output.
import { step } from './lib/step.mjs';

const [project, ...rest] = process.argv.slice(2);
const args = [];
const extraEnv = {};
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--base-url') extraEnv.BASE_URL = rest[++i];
  else if (rest[i].startsWith('--base-url='))
    extraEnv.BASE_URL = rest[i].slice('--base-url='.length);
  else args.push(rest[i]);
}
process.exit(
  step(
    `test-${project}`,
    'npx',
    ['playwright', 'test', `--project=${project}`, '--pass-with-no-tests', ...args],
    extraEnv,
  ),
);
