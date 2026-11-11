'use client';

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import styles from './ScrollSequence.module.css';

export type ScrollSequenceHandle = {
  /** Set scroll progress of the pinned section, 0 to 1. Cheap: no React state. */
  setProgress: (progress: number) => void;
};

export type ScrollSequenceProps = {
  /** Public folder with the frames, e.g. /frames/dough */
  dir: string;
  /** Number of frames. 0 means not delivered yet: show the poster or fallback. */
  count: number;
  ext: 'webp' | 'jpg';
  /** Still image shown until frames are ready. */
  poster: string;
  alt: string;
  ref?: Ref<ScrollSequenceHandle>;
};

const LOGO_SRC = '/brand/logo-mark.jpg';
const PRELOAD_CONCURRENCY = 6;
const MAX_DPR = 2;

const pad = (n: number) => String(n).padStart(4, '0');
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Draws one frame of an image sequence into a canvas, chosen by scroll progress.
 * The parent BeatSection pins the section and calls `setProgress` through the ref.
 */
export function ScrollSequence({ dir, count, ext, poster, alt, ref }: ScrollSequenceProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<{ setProgress: (p: number) => void } | null>(null);

  const [reduced, setReduced] = useState(false);
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

  // Reduced motion: no scrubbing, show the poster or fallback only.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (reduced || count <= 0 || !stage || !canvas) {
      engineRef.current = null;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      engineRef.current = null;
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let progress = 0;
    let lastTarget = -1;
    let drawn = -1;
    const frames: (HTMLImageElement | null)[] = new Array(count).fill(null);

    const indexFor = (p: number) => Math.round(clamp01(p) * (count - 1));

    const sizeCanvas = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      // Resizing the canvas resets its context state.
      ctx.imageSmoothingEnabled = false;
      drawn = -1;
    };

    const draw = () => {
      const target = indexFor(progress);
      // Use the wanted frame, or the nearest loaded one while it loads.
      let src = -1;
      for (let i = target; i >= 0; i--) {
        if (frames[i]) {
          src = i;
          break;
        }
      }
      if (src === -1) {
        for (let i = target + 1; i < count; i++) {
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
      // object-fit: cover maths
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.imageSmoothingEnabled = false;
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

    const setProgress = (p: number) => {
      progress = clamp01(p);
      const target = indexFor(progress);
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

    const loadFrame = (i: number) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = `${dir}/${pad(i + 1)}.${ext}`;
      });

    // Preload: frame 1 first, so something shows at once. Then the rest in a small pool.
    const run = async () => {
      const first = await loadFrame(0);
      if (cancelled) return;
      if (!first) {
        // Frame 1 failed: keep the poster or fallback on screen.
        return;
      }
      frames[0] = first;
      setFrameMode(true);
      lastTarget = -1;
      setProgress(progress);

      let next = 1;
      const worker = async () => {
        while (!cancelled && next < count) {
          const i = next++;
          const img = await loadFrame(i);
          if (cancelled) return;
          if (img) {
            frames[i] = img;
            schedule();
          }
        }
      };
      await Promise.all(Array.from({ length: PRELOAD_CONCURRENCY }, worker));
    };
    void run();

    return () => {
      cancelled = true;
      ro.disconnect();
      if (rafId !== 0) cancelAnimationFrame(rafId);
      engineRef.current = null;
      setFrameMode(false);
    };
  }, [dir, count, ext, reduced]);

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
        (posterState === 'ok' ? (
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
