// Everything: typecheck, lint, tokens, production build, then every test suite against the build.
import { spawnSync } from 'node:child_process';

const failures = [];
const finish = () => {
  console.log(failures.length ? `\nverify FAILED: ${failures.join(', ')}` : '\nverify passed');
  process.exit(failures.length ? 1 : 0);
};
const run = (label, cmd, args, extraEnv = {}, stopOnFail = false) => {
  console.log(`\n=== ${label}`);
  const r = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, ...extraEnv },
  });
  if (r.status !== 0) {
    failures.push(label);
    if (stopOnFail) finish();
  }
};

run('typecheck', 'npm', ['run', 'typecheck']);
run('lint', 'npm', ['run', 'lint']);
run('check:tokens', 'npm', ['run', 'check:tokens']);
run('build', 'npm', ['run', 'build'], {}, true);
for (const suite of ['e2e', 'responsive', 'links', 'a11y', 'visual']) {
  run(`test:${suite}`, 'node', ['scripts/run-tests.mjs', suite], { PW_SERVER: 'build' });
}
finish();
