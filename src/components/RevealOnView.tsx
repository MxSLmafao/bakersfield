'use client';

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import styles from './RevealOnView.module.css';

/**
 * Wraps its children in a block that rises and fades in once, the first time
 * it is in view. Later scrolling does not hide it again.
 *
 * The content is visible by default, so it shows without JavaScript. The
 * script hides it (sets data-armed) only when it is below the fold, JavaScript
 * runs and reduced motion is not requested. Without IntersectionObserver it
 * never hides the content.
 */
export function RevealOnView({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  // Runs before the first paint, so the hidden state never flashes on screen.
  // Only the client sets it, so the server HTML and the first client render match.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) setArmed(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cls = className ? `${className} ${styles.reveal}` : styles.reveal;
  return (
    <div
      ref={ref}
      className={cls}
      data-armed={armed ? 'true' : undefined}
      data-shown={shown ? 'true' : 'false'}
    >
      {children}
    </div>
  );
}
