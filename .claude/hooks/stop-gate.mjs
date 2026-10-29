#!/usr/bin/env node
// Stop hook: keeps the orchestrator working until every page in pages.json is
// "done", "blocked" or "skipped" and log.md has a "Final sweep" entry.
//
// Only active while .claude/hooks/.build-active exists. The orchestrator
// creates that file when it starts and deletes it when the build is finished.
// Delete it yourself to switch the gate off.
//
// Safety valve: if pages.json and log.md haven't changed across MAX_IDLE
// consecutive blocked stops, the gate lets the session stop so a stuck loop
// can't run forever.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const MAX_IDLE = 25;
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const flag = join(root, '.claude/hooks/.build-active');
const stateFile = join(root, '.claude/hooks/.stop-gate-state.json');

// Drain stdin (hook input) so the hook never blocks on an unread pipe.
try { readFileSync(0); } catch {}

if (!existsSync(flag)) process.exit(0);

let pages;
try {
  pages = JSON.parse(readFileSync(join(root, 'pages.json'), 'utf8'));
} catch (e) {
  process.exit(0); // no manifest -> nothing to enforce
}
const log = existsSync(join(root, 'log.md')) ? readFileSync(join(root, 'log.md'), 'utf8') : '';

const open = (pages.pages || []).filter((p) => !['done', 'blocked', 'skipped'].includes(p.status));
const finalSweepLogged = /^##\s+.*final sweep/im.test(log);
if (open.length === 0 && finalSweepLogged) {
  process.exit(0);
}

// Progress detection for the safety valve.
const hash = createHash('sha1').update(JSON.stringify(pages)).update(log).digest('hex');
let state = { hash: '', idle: 0 };
try { state = JSON.parse(readFileSync(stateFile, 'utf8')); } catch {}
state.idle = state.hash === hash ? state.idle + 1 : 0;
state.hash = hash;
try { writeFileSync(stateFile, JSON.stringify(state)); } catch {}

if (state.idle >= MAX_IDLE) {
  process.stderr.write(`stop-gate: no progress in pages.json/log.md across ${MAX_IDLE} stops; allowing stop.\n`);
  process.exit(0);
}

const next = open.slice(0, 8).map((p) => `${p.id} (${p.group}, ${p.status})`).join(', ');
const reason = open.length
  ? `Build not finished: ${open.length} page(s) still open — ${next}${open.length > 8 ? ', …' : ''}. ` +
    'Continue with the next group per PLAN.md §5. If you are blocked on the owner, mark the page "blocked" with a reason, log it, and move on.'
  : 'All pages are done, blocked or skipped, but log.md has no "Final sweep" entry. Run Phase 3 (PLAN.md §4) and log it.';

process.stdout.write(JSON.stringify({ decision: 'block', reason }));
process.exit(0);
