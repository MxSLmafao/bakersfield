const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Segment index for a global progress 0..1, split into `count` equal parts. */
export function segmentAt(progress: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(count - 1, Math.floor(clamp01(progress) * count));
}

/** Progress inside one segment, 0..1. */
export function localAt(progress: number, count: number, segment: number): number {
  return clamp01(clamp01(progress) * count - segment);
}
