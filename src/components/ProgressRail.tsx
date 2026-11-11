'use client';

import { useEffect, useState } from 'react';
import { beats } from '@/content/beats';
import styles from './ProgressRail.module.css';

const ids = beats.map((beat) => `beat-${beat.slug}`);

/** Fixed side rail of eight dots. Shows the beat in view. Hidden on mobile. */
export function ProgressRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    // The band across the middle of the viewport decides the active beat.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = ids.indexOf(entry.target.id);
            if (index !== -1) setActive(index);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className={styles.rail} aria-label="Beats">
      <ol className={styles.list}>
        {beats.map((beat, i) => (
          <li key={beat.id}>
            <a
              className={styles.link}
              href={`#beat-${beat.slug}`}
              aria-label={`${i + 1}. ${beat.title}`}
              aria-current={i === active ? 'step' : undefined}
              data-active={i === active ? 'true' : 'false'}
            >
              <span className={styles.dot} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
