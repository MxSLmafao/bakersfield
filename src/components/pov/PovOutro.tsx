import { povOutro } from '@/content/pov';
import styles from './PovOutro.module.css';

/** Calm closing screen: title, line, one glass call to action, a quiet link back to the pixel version. */
export function PovOutro() {
  const year = new Date().getFullYear();
  return (
    <section className={styles.outro} aria-labelledby="pov-outro-title">
      <div className={styles.inner}>
        <h2 id="pov-outro-title" className={styles.title}>
          {povOutro.title}
        </h2>
        <p className={styles.body}>{povOutro.body}</p>
        <div className={styles.actions}>
          {/* TODO: real contact details from client */}
          <a className={styles.cta} href="#">
            {povOutro.cta}
          </a>
          {/* A plain link: Next prefetching "/" here would put the home page's frame preload on this page. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className={styles.secondary} href="/">
            {povOutro.secondary}
          </a>
        </div>
      </div>
      <p className={styles.footer}>&copy; Bakersfield {year}</p>
    </section>
  );
}
