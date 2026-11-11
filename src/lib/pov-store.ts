import { useSyncExternalStore } from 'react';
import { scrollToY } from '@/lib/scroll';

/** Where the visitor is: before the story, inside it, or after it. */
export type PovZone = 'hero' | 'story' | 'outro';

export type PovState = {
  zone: PovZone;
  /** Story segment index 0..5. Only meaningful when zone is 'story'. */
  segment: number;
};

const initial: PovState = { zone: 'hero', segment: 0 };
let state: PovState = initial;
const listeners = new Set<() => void>();

export function getPovState(): PovState {
  return state;
}

export function subscribePovState(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Sets the state. Listeners run only when the value really changes. */
export function setPovState(zone: PovZone, segment: number): void {
  if (state.zone === zone && state.segment === segment) return;
  state = { zone, segment };
  listeners.forEach((listener) => listener());
}

export function usePovState(): PovState {
  return useSyncExternalStore(subscribePovState, getPovState, () => initial);
}

const beatY = new Map<string, () => number>();

/** The pinned story registers where each segment starts. Returns an unregister function. */
export function registerPovY(slug: string, getY: () => number): () => void {
  beatY.set(slug, getY);
  return () => {
    if (beatY.get(slug) === getY) beatY.delete(slug);
  };
}

/** Scrolls to the start of a segment. Returns false when the story is not pinned. */
export function scrollToPovBeat(slug: string): boolean {
  const getY = beatY.get(slug);
  if (!getY) return false;
  scrollToY(getY());
  return true;
}
