import { SESSION_STORAGE_KEY, MOCK_USER_ID } from '@/lib/session/session';
import { DARK_QUERY, THEME_STORAGE_KEY } from './theme';

/** sessionStorage key holding the id of the site notice the visitor dismissed. */
export const NOTICE_DISMISSED_KEY = 'mlc-notice-dismissed';

/**
 * The one script in <head> that runs before first paint, so the page never flashes the wrong
 * state. A string because it must run before React loads. It sets on <html>:
 * - data-theme: "light" | "dark" (blocked storage falls back to the system setting)
 * - data-session: "signed-in" | "guest", so the right header actions show without a flash
 * - data-notice: "dismissed" when this session already closed the current notice
 * Every storage read is in try/catch.
 */
export function buildShellScript(currentNoticeId: string | null): string {
  const noticeId = JSON.stringify(currentNoticeId);
  return `(function(){var d=document.documentElement,t=null,s=null;try{t=localStorage.getItem('${THEME_STORAGE_KEY}');}catch(e){}var dark=t==='dark'||(t!=='light'&&window.matchMedia('${DARK_QUERY}').matches);d.dataset.theme=dark?'dark':'light';var signed=false;try{s=localStorage.getItem('${SESSION_STORAGE_KEY}');signed=!!s&&JSON.parse(s).userId==='${MOCK_USER_ID}';}catch(e){}d.dataset.session=signed?'signed-in':'guest';var n=${noticeId};if(n){try{if(sessionStorage.getItem('${NOTICE_DISMISSED_KEY}')===n)d.dataset.notice='dismissed';}catch(e){}}})();`;
}
