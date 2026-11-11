'use client';

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import type { FrameSet } from '@/content/beats';
import { PHONE_QUERY } from '@/lib/device';
import { segmentAt } from '@/lib/segments';
import styles from './PovSequence.module.css';

/*
 * Copy of the shared ScrollSequence engine with two additions:
 *  1. `fit`: 'cover' fills the stage (centre crop), 'contain' shows the whole frame.
 *  2. `cuts` + `fadeSpan`: segments that start with a hard cut to another shot
 *     are blended on the same canvas. The blend is driven by scroll progress, so
 *     it scrubs both ways. Seamless joins are not listed and never blend.
 * Lazy per-segment loading, nearest-loaded fallback, DPR cap, no idle rAF,
 * the small-set canvas cap and the poster behave as in the original.
 */

export type PovSequenceHandle = {
  /** Set the global progress of the story, 0 to 1. Cheap: no React state. */
  setProgress: (progress: number) => void;
};

export type PovSequenceProps = {
  segments: readonly FrameSet[];
  poster: string;
  posterSm: string;
  alt: string;
  concurrency: number;
  /** Cap the canvas backing store at 2x the native frame size. Used for the small set. */
  capToFrame: boolean;
  fit: 'cover' | 'contain';
  /** Segment indexes that begin with a hard cut. */
  cuts: readonly number[];
  /** Blend length as a fraction of one segment, centred on the cut. */
  fadeSpan: number;
  ref?: Ref<PovSequenceHandle>;
};

const LOGO_SRC = '/brand/logo-mark.jpg';
const MAX_DPR = 2;
/** Start loading when the stage is within 1.5 viewports of the screen. */
const LOAD_MARGIN = '150% 0px 150% 0px';
const CAP_FACTOR = 2;
/** Blend alpha is quantised so tiny scroll moves do not redraw. */
const ALPHA_STEPS = 48;

const TODO = 0;
const LOADING = 1;
const DONE = 2;
const FAILED = 3;

const pad = (n: number) => String(n).padStart(4, '0');
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth = (t: number) => t * t * (3 - 2 * t);

export function PovSequence({
  segments,
  poster,
  posterSm,
  alt,
  concurrency,
  capToFrame,
  fit,
  cuts,
  fadeSpan,
  ref,
}: PovSequenceProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PovSequenceHandle | null>(null);

  const [frameMode, setFrameMode] = useState(false);
  const [posterState, setPosterState] = useState<'pending' | 'ok' | 'failed'>('pending');

  useImperativeHandle(
    ref,
    () => ({
      setProgress: (progress: number) => engineRef.current?.setProgress(progress),
    }),
    [],
  );

  // Check the poster in script, not with onError: a failed image can finish
  // loading before hydration and the event is then missed.
  useEffect(() => {
    const img = new Image();
    img.onload = () => setPosterState('ok');
    img.onerror = () => setPosterState('failed');
    img.src = window.matchMedia(PHONE_QUERY).matches ? posterSm : poster;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [poster, posterSm]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const offsets: number[] = [];
    const urls: string[] = [];
    for (const set of segments) {
      offsets.push(urls.length);
      for (let i = 0; i < set.count; i++) {
        urls.push(`${set.dir}/${pad(i + 1)}.${set.ext}`);
      }
    }
    const total = urls.length;
    if (total === 0) return;
    const segmentCount = segments.length;
    const cutSet = new Set(cuts.filter((s) => s > 0 && s < segmentCount));
    const half = fadeSpan / 2;

    /** Frame to show for a progress, with the cut windows held on the edge frames. */
    const frameIndexFor = (p: number) => {
      const seg = segmentAt(p, segmentCount);
      const count = segments[seg].count;
      const rel = clamp01(p) * segmentCount - seg;
      const lo = cutSet.has(seg) ? half : 0;
      const hi = cutSet.has(seg + 1) ? 1 - half : 1;
      const local = clamp01((rel - lo) / (hi - lo));
      return offsets[seg] + Math.max(0, Math.round(local * (count - 1)));
    };

    /** Frames to draw: the main one, and an incoming one with its alpha inside a cut window. */
    const resolve = (p: number): { a: number; b: number; alpha: number } => {
      const x = clamp01(p) * segmentCount;
      for (const s of cutSet) {
        const d = x - s;
        if (d > -half && d < half) {
          const raw = (d + half) / (2 * half);
          return {
            a: offsets[s - 1] + segments[s - 1].count - 1,
            b: offsets[s],
            alpha: smooth(raw),
          };
        }
      }
      return { a: frameIndexFor(p), b: -1, alpha: 0 };
    };

    let cancelled = false;
    let rafId = 0;
    let progress = 0;
    let lastKey = '';
    let drawnKey = '';
    let active = false;
    let focusSeg = 0;
    let running = 0;
    let nativeSize = 0;
    let shown = false;
    const frames: (HTMLImageElement | null)[] = new Array(total).fill(null);
    const status: Uint8Array = new Uint8Array(total);

    const sizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      let w = rect.width * dpr;
      let h = rect.height * dpr;
      if (capToFrame && nativeSize > 0) {
        const k = Math.min(1, (nativeSize * CAP_FACTOR) / Math.max(w, h));
        w *= k;
        h *= k;
      }
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      drawnKey = ''; // Resizing resets the canvas.
    };

    /** The wanted frame, or the nearest loaded one while it loads. */
    const loadedNear = (target: number): HTMLImageElement | null => {
      for (let i = target; i >= 0; i--) if (frames[i]) return frames[i];
      for (let i = target + 1; i < total; i++) if (frames[i]) return frames[i];
      return null;
    };

    const paint = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = fit === 'cover' ? Math.max(cw / iw, ch / ih) : Math.min(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const keyFor = (p: number) => {
      const r = resolve(p);
      return { r, key: `${r.a}|${r.b}|${r.b >= 0 ? Math.round(r.alpha * ALPHA_STEPS) : 0}` };
    };

    const draw = () => {
      const { r, key } = keyFor(progress);
      if (key === drawnKey) return;
      const imgA = loadedNear(r.a);
      if (!imgA) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      paint(imgA);
      if (r.b >= 0 && r.alpha > 0.004) {
        const imgB = loadedNear(r.b);
        if (imgB) {
          ctx.globalAlpha = r.alpha;
          paint(imgB);
          ctx.globalAlpha = 1;
        }
      }
      drawnKey = key;
    };

    const schedule = () => {
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (!cancelled) draw();
      });
    };

    const loadFrame = (i: number) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = urls[i];
      });

    // Next frame to fetch. Edge frames of the neighbours come first, so a cut
    // can blend in both directions. Then the focus segment, nearest frame
    // first, then the first frames of the next segment in order.
    const pickNext = (): number => {
      const edges = [focusSeg - 1 >= 0 ? offsets[focusSeg] - 1 : -1, focusSeg + 1 < segmentCount ? offsets[focusSeg + 1] : -1];
      for (const i of edges) if (i >= 0 && status[i] === TODO) return i;
      const target = frameIndexFor(progress);
      for (const seg of [focusSeg, focusSeg + 1]) {
        if (seg >= segmentCount) continue;
        const start = offsets[seg];
        const end = start + segments[seg].count;
        let best = -1;
        let bestDist = Infinity;
        for (let i = start; i < end; i++) {
          if (status[i] !== TODO) continue;
          const dist = seg === focusSeg ? Math.abs(i - target) : i - start;
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        }
        if (best !== -1) return best;
      }
      return -1;
    };

    const pump = () => {
      if (cancelled || !active) return;
      while (running < concurrency) {
        const i = pickNext();
        if (i < 0) return;
        status[i] = LOADING;
        running++;
        void loadFrame(i).then((img) => {
          running--;
          if (cancelled) return;
          if (img) {
            status[i] = DONE;
            frames[i] = img;
            if (nativeSize === 0) {
              nativeSize = img.naturalWidth;
              sizeCanvas();
            }
            if (!shown) {
              shown = true;
              setFrameMode(true);
            }
            drawnKey = '';
            schedule();
          } else {
            status[i] = FAILED;
          }
          pump();
        });
      }
    };

    const setProgress = (p: number) => {
      progress = clamp01(p);
      const seg = segmentAt(progress, segmentCount);
      if (seg !== focusSeg) {
        focusSeg = seg;
        pump();
      }
      const { key } = keyFor(progress);
      if (key === lastKey) return;
      lastKey = key;
      schedule();
    };

    engineRef.current = { setProgress };

    sizeCanvas();
    const ro = new ResizeObserver(() => {
      sizeCanvas();
      schedule();
    });
    ro.observe(stage);

    let io: IntersectionObserver | null = null;
    const start = () => {
      active = true;
      pump();
    };
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          io?.disconnect();
          io = null;
          start();
        },
        { rootMargin: LOAD_MARGIN },
      );
      io.observe(stage);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      io?.disconnect();
      ro.disconnect();
      if (rafId !== 0) cancelAnimationFrame(rafId);
      engineRef.current = null;
      setFrameMode(false);
    };
  }, [segments, concurrency, capToFrame, fit, cuts, fadeSpan]);

  const showPoster = !frameMode;

  return (
    <div ref={stageRef} className={styles.stage}>
      <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label={alt} hidden={!frameMode} />
      {showPoster &&
        (posterState !== 'failed' ? (
          <picture>
            <source media={PHONE_QUERY} srcSet={posterSm} />
            <img className={styles.poster} data-fit={fit} src={poster} alt={alt} width={960} height={540} />
          </picture>
        ) : (
          <div className={styles.fallback}>
            {/* Decorative: the section title already names the beat. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={styles.logo} src={LOGO_SRC} alt="" width={1024} height={1024} />
          </div>
        ))}
    </div>
  );
}
