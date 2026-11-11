'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './RevealOnView.module.css';

/**
 * Wraps its children in a block that rises and fades in once, the first time
 * it is in view. Later scrolling does not hide it again. Without
 * IntersectionObserver the content shows at once.
 */
export function RevealOnView({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

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
    <div ref={ref} className={cls} data-shown={shown ? 'true' : 'false'}>
      {children}
    </div>
  );
}
