import type { Beat } from '@/content/beats';
import styles from './Visit.module.css';

/** Closing section with the call to action. */
export function Visit({ beat }: { beat: Beat }) {
  return (
    <section id={`beat-${beat.slug}`} className={styles.visit} aria-labelledby="visit-title">
      <div className={styles.card}>
        <p className={styles.num} aria-hidden="true">
          08
        </p>
        <h2 id="visit-title" className={styles.title}>
          {beat.title}
        </h2>
        <p className={styles.body}>{beat.body}</p>
        {/* TODO: real contact details from client */}
        <a className={styles.button} href="#">
          Come say bonjour
        </a>
      </div>
    </section>
  );
}
