import { useSyncExternalStore } from 'react';

/** Where the visitor is: before the story, inside it, or after it. */
export type BeatZone = 'hero' | 'story' | 'visit';

export type BeatState = {
  zone: BeatZone;
  /** Story segment index 0..5. Only meaningful when zone is 'story'. */
  segment: number;
};

const initial: BeatState = { zone: 'hero', segment: 0 };
let state: BeatState = initial;
const listeners = new Set<() => void>();

export function getBeatState(): BeatState {
  return state;
}

export function subscribeBeatState(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Sets the state. Listeners run only when the value really changes. */
export function setBeatState(zone: BeatZone, segment: number): void {
  if (state.zone === zone && state.segment === segment) return;
  state = { zone, segment };
  listeners.forEach((listener) => listener());
}

export function useBeatState(): BeatState {
  return useSyncExternalStore(subscribeBeatState, getBeatState, () => initial);
}
