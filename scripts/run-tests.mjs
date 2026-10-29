// Usage: node scripts/run-tests.mjs <project> [--base-url <url>] [extra playwright args]
import { spawnSync } from 'node:child_process';

const [project, ...rest] = process.argv.slice(2);
const args = [];
const env = { ...process.env };
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--base-url') env.BASE_URL = rest[++i];
  else if (rest[i].startsWith('--base-url=')) env.BASE_URL = rest[i].slice('--base-url='.length);
  else args.push(rest[i]);
}
const result = spawnSync(
  'npx',
  ['playwright', 'test', `--project=${project}`, '--pass-with-no-tests', ...args],
  {
    stdio: 'inherit',
    env,
    shell: process.platform === 'win32',
  },
);
process.exit(result.status ?? 1);
