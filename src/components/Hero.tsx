import type { Beat } from '@/content/beats';
import { withVersion } from '@/lib/asset-version';
import styles from './Hero.module.css';

/** Full-viewport opening. Server-rendered: the entrance is CSS only. */
export function Hero({ beat }: { beat: Beat }) {
  return (
    <section id={`beat-${beat.slug}`} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.inner}>
        <div className={styles.mark}>
          {/* This is the LCP image: load it first and never lazily. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.logo}
            src={withVersion('/brand/logo-mark.webp')}
            alt="Bakersfield logo: a pixel croissant with a moustache"
            width={512}
            height={512}
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <h1 id="hero-title" className={styles.wordmark}>
          {beat.title}
        </h1>
        <p className={styles.tagline}>{beat.body}</p>
      </div>
      <a className={styles.scroll} href="#beat-ingredients">
        <span>Scroll</span>
        <span className={styles.arrow} aria-hidden="true" />
      </a>
    </section>
  );
}
