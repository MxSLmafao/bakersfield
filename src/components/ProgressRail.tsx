'use client';

import { beats } from '@/content/beats';
import { useBeatState } from '@/lib/beat-store';
import styles from './ProgressRail.module.css';

const LAST = beats.length - 1;

/**
 * Fixed side rail of eight dots: hero, six story beats, visit.
 * The active dot follows the shared beat state. Hidden on mobile.
 * Clicks are routed by the scroll helper in scroll.ts.
 */
export function ProgressRail() {
  const { zone, segment } = useBeatState();
  const active = zone === 'hero' ? 0 : zone === 'visit' ? LAST : segment + 1;

  return (
    <nav className={styles.rail} aria-label="Beats">
      <ol className={styles.list}>
        {beats.map((beat, i) => {
          const isActive = i === active;
          return (
            <li key={beat.id}>
              <a
                className={styles.link}
                href={`#beat-${beat.slug}`}
                aria-label={`${i + 1}. ${beat.title}`}
                aria-current={isActive ? 'step' : undefined}
                data-active={isActive ? 'true' : 'false'}
              >
                <span className={styles.dot} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
