/**
 * Phones: narrow portrait screens, and short landscape screens.
 * Desktop windows do not match, so their behaviour stays as it was.
 */
export const PHONE_QUERY = '(max-width: 767px), (max-width: 932px) and (max-height: 500px)';

const SLOW_CONNECTIONS: readonly string[] = ['slow-2g', '2g', '3g'];

/** The non-standard Network Information API, typed without `any`. */
type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };
type NavigatorWithConnection = Navigator & { connection?: NetworkInformationLike };

export function isPhone(): boolean {
  return window.matchMedia(PHONE_QUERY).matches;
}

export function isCoarsePointer(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * True when the small frame set should be used: a phone, a data saver
 * visitor, or a slow connection. Call once, on mount.
 */
export function wantsSmallFrames(): boolean {
  if (isPhone()) return true;
  const connection = (navigator as NavigatorWithConnection).connection;
  if (!connection) return false;
  if (connection.saveData === true) return true;
  return typeof connection.effectiveType === 'string' && SLOW_CONNECTIONS.includes(connection.effectiveType);
}

/**
 * Height of 100svh, the smallest viewport. It does not change when the
 * mobile address bar shows or hides. Falls back to innerHeight.
 */
export function stableViewportHeight(): number {
  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText =
    'position:fixed;top:0;left:0;width:0;height:100vh;height:100svh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);
  const height = probe.getBoundingClientRect().height;
  probe.remove();
  return height > 0 ? height : window.innerHeight;
}
