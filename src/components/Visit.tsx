import type { Beat } from '@/content/beats';
import { RevealOnView } from './RevealOnView';
import styles from './Visit.module.css';

/** Computed at build time. The site is static. */
const YEAR = new Date().getFullYear();

/** Closing section with the call to action. */
export function Visit({ beat }: { beat: Beat }) {
  return (
    <section id={`beat-${beat.slug}`} className={styles.visit} aria-labelledby="visit-title">
      <RevealOnView className={styles.card}>
        <p className={styles.num} aria-hidden="true">
          08
        </p>
        <h2 id="visit-title" className={styles.title}>
          {beat.title}
        </h2>
        <p className={styles.body}>{beat.body}</p>
        <div className={styles.actions}>
          {/* TODO: real contact details from client */}
          <a className={styles.button} href="#">
            Come say bonjour
          </a>
        </div>
      </RevealOnView>
      <p className={styles.foot}>© Bakersfield {YEAR}</p>
    </section>
  );
}
