'use client';

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import type { FrameSet } from '@/content/beats';
import { localAt, segmentAt } from '@/lib/segments';
import styles from './ScrollSequence.module.css';

export type ScrollSequenceHandle = {
  /** Set the global progress of the story, 0 to 1. Cheap: no React state. */
  setProgress: (progress: number) => void;
};

export type ScrollSequenceProps = {
  /** Frame sets that play one after the other, as one flat list. */
  segments: readonly FrameSet[];
  /** Still image shown until the first frame is ready. */
  poster: string;
  alt: string;
  /** Parallel frame downloads. */
  concurrency: number;
  /** Cap the canvas backing store at 2x the native frame size. Used for the small set. */
  capToFrame: boolean;
  ref?: Ref<ScrollSequenceHandle>;
};

const LOGO_SRC = '/brand/logo-mark.jpg';
const MAX_DPR = 2;
/** Start loading when the stage is within 1.5 viewports of the screen. */
const LOAD_MARGIN = '150% 0px 150% 0px';
const CAP_FACTOR = 2;

const TODO = 0;
const LOADING = 1;
const DONE = 2;
const FAILED = 3;

const pad = (n: number) => String(n).padStart(4, '0');
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Draws one frame of a flat list of image sequences into a canvas.
 * Global progress picks the segment, and local progress picks the frame.
 * The frame is fitted with "contain", so the whole square is always visible.
 * The parent StorySection pins the section and calls `setProgress` through the ref.
 *
 * Loading: nothing loads until the stage nears the screen. Then the segment
 * the visitor is in loads first, then the next one, then the rest in order.
 */
export function ScrollSequence({
  segments,
  poster,
  alt,
  concurrency,
  capToFrame,
  ref,
}: ScrollSequenceProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ScrollSequenceHandle | null>(null);

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
    img.src = poster;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [poster]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flat frame list: segment offsets and the URL of every frame.
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

    const frameIndexFor = (p: number) => {
      const seg = segmentAt(p, segmentCount);
      const count = segments[seg].count;
      const local = localAt(p, segmentCount, seg);
      return offsets[seg] + Math.max(0, Math.round(local * (count - 1)));
    };

    let cancelled = false;
    let rafId = 0;
    let progress = 0;
    let lastTarget = -1;
    let drawn = -1;
    let active = false;
    let focusSeg = 0;
    let running = 0;
    let nativeSize = 0;
    let shown = false;
    const frames: (HTMLImageElement | null)[] = new Array(total).fill(null);
    const status: Uint8Array = new Uint8Array(total); // all TODO

    const sizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      let w = rect.width * dpr;
      let h = rect.height * dpr;
      if (capToFrame && nativeSize > 0) {
        // No point upscaling a small frame into a much larger canvas.
        const k = Math.min(1, (nativeSize * CAP_FACTOR) / Math.max(w, h));
        w *= k;
        h *= k;
      }
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      // Resizing the canvas resets its context state.
      drawn = -1;
    };

    const draw = () => {
      const target = frameIndexFor(progress);
      // Use the wanted frame, or the nearest loaded one while it loads.
      let src = -1;
      for (let i = target; i >= 0; i--) {
        if (frames[i]) {
          src = i;
          break;
        }
      }
      if (src === -1) {
        for (let i = target + 1; i < total; i++) {
          if (frames[i]) {
            src = i;
            break;
          }
        }
      }
      if (src === -1 || src === drawn) return;
      const img = frames[src];
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      // object-fit: contain maths
      const scale = Math.min(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      drawn = src;
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

    // Next frame to fetch. Only the focus segment and the one after it are
    // wanted. The focus segment goes first, nearest frame first.
    // Other segments load only when the focus moves to them.
    const pickNext = (): number => {
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
      const target = frameIndexFor(progress);
      if (target === lastTarget) return;
      lastTarget = target;
      schedule();
    };

    engineRef.current = { setProgress };

    sizeCanvas();
    const ro = new ResizeObserver(() => {
      sizeCanvas();
      schedule();
    });
    ro.observe(stage);

    // Start loading only when the stage is near the screen.
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
  }, [segments, concurrency, capToFrame]);

  const showPoster = !frameMode;

  return (
    <div ref={stageRef} className={styles.stage}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        role="img"
        aria-label={alt}
        hidden={!frameMode}
      />
      {showPoster &&
        (posterState !== 'failed' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.poster} src={poster} alt={alt} />
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
