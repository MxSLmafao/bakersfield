import { povHero, povSequenceBeats } from '@/content/pov';
import { withVersion } from '@/lib/asset-version';
import { PHONE_QUERY } from '@/lib/device';
import styles from './PovHero.module.css';

/**
 * Full-viewport opening. The backdrop is the first frame of the story, so the
 * scroll into the pinned footage starts on the same marble.
 */
export function PovHero() {
  const first = povSequenceBeats[0];
  return (
    <section className={styles.hero} aria-labelledby="pov-hero-title">
      <picture>
        <source media={PHONE_QUERY} srcSet={withVersion(povHero.imageSm)} />
        <img
          className={styles.image}
          src={withVersion(povHero.image)}
          alt=""
          width={960}
          height={540}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.content}>
        {/* Decorative: the wordmark below names the brand. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${styles.logo} ${styles.rise}`}
          style={{ '--d': '0ms' } as React.CSSProperties}
          src={withVersion('/brand/logo-mark.webp')}
          alt=""
          width={56}
          height={56}
        />
        <h1
          id="pov-hero-title"
          className={`${styles.wordmark} ${styles.rise}`}
          style={{ '--d': '70ms' } as React.CSSProperties}
        >
          {povHero.title}
        </h1>
        <p className={`${styles.line} ${styles.rise}`} style={{ '--d': '140ms' } as React.CSSProperties}>
          {povHero.line}
        </p>
      </div>
      <a
        className={`${styles.scroll} ${styles.rise}`}
        style={{ '--d': '260ms' } as React.CSSProperties}
        href={`#pov-${first.slug}`}
      >
        Scroll
        <svg className={styles.arrow} width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M7 2v9m0 0L3.5 7.5M7 11l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </section>
  );
}
