import { DARK_QUERY, THEME_STORAGE_KEY } from './theme';

/**
 * Runs in <head> before first paint so the page never flashes the wrong theme.
 * A string because it must run before React loads. Blocked storage falls back to the system setting.
 */
export const themeScript = `(function(){var d=document.documentElement,s=null;try{s=localStorage.getItem('${THEME_STORAGE_KEY}');}catch(e){}var dark=s==='dark'||(s!=='light'&&window.matchMedia('${DARK_QUERY}').matches);d.dataset.theme=dark?'dark':'light';})();`;
