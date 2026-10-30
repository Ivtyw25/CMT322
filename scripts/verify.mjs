// Everything: typecheck, lint, tokens, production build, then every test suite against the build.
// Quiet: one line per step, failure excerpts only, full logs in .logs/ (VERBOSE=1 to stream).
import { step } from './lib/step.mjs';

const failures = [];
const finish = () => {
  console.log(failures.length ? `\nverify FAILED: ${failures.join(', ')}` : '\nverify passed');
  process.exit(failures.length ? 1 : 0);
};
const run = (label, cmd, args, extraEnv = {}, stopOnFail = false) => {
  if (step(label, cmd, args, extraEnv) !== 0) {
    failures.push(label);
    if (stopOnFail) finish();
  }
};

run('typecheck', 'npm', ['run', 'typecheck']);
run('lint', 'npm', ['run', 'lint']);
run('check-tokens', 'npm', ['run', 'check:tokens']);
run('build', 'npm', ['run', 'build'], {}, true);
// Behaviour tests use the dev-only gallery (/dev/components is a 404 in production), so they run on
// the dev server. Layout, links, accessibility and visuals run against the production build.
run('verify-e2e', 'node', ['scripts/run-tests.mjs', 'e2e']);
for (const suite of ['responsive', 'links', 'a11y', 'visual']) {
  run(`verify-${suite}`, 'node', ['scripts/run-tests.mjs', suite], { PW_SERVER: 'build' });
}
finish();
