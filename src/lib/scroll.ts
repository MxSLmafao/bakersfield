import type Lenis from 'lenis';

let smoother: Lenis | null = null;
const pinnedBeatY = new Map<string, () => number>();

/** Called by SmoothScroll when Lenis starts or stops. */
export function setSmoother(instance: Lenis | null): void {
  smoother = instance;
}

/**
 * The pinned story registers the scroll position where each beat starts.
 * Returns a function that removes the registration.
 */
export function registerBeatY(slug: string, getY: () => number): () => void {
  pinnedBeatY.set(slug, getY);
  return () => {
    if (pinnedBeatY.get(slug) === getY) pinnedBeatY.delete(slug);
  };
}

export function scrollToY(y: number): void {
  if (smoother) {
    smoother.scrollTo(y, { duration: 1.2 });
    return;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
}

/**
 * Scrolls to the beat with this slug. Uses the pinned story position when
 * one is registered, else the element with id `beat-<slug>`.
 * Returns false when the beat cannot be found.
 */
export function scrollToBeat(slug: string): boolean {
  const getY = pinnedBeatY.get(slug);
  if (getY) {
    scrollToY(getY());
    return true;
  }
  const el = document.getElementById(`beat-${slug}`);
  if (!el) return false;
  scrollToY(el.getBoundingClientRect().top + window.scrollY);
  return true;
}
