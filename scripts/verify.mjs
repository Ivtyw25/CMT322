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
// The test build keeps the dev gallery on (src/lib/dev-gallery.ts), so every suite, behaviour tests
// included, runs against `next start`: no first-visit compiles, no dev-server timeouts.
const testBuild = { DEV_GALLERY: '1' };
run('build', 'npm', ['run', 'build'], testBuild, true);
for (const suite of ['e2e', 'responsive', 'links', 'a11y', 'visual']) {
  run(`verify-${suite}`, 'node', ['scripts/run-tests.mjs', suite], {
    ...testBuild,
    PW_SERVER: 'build',
  });
}
finish();
