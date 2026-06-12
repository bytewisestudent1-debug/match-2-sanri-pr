import styles from './LoadingScreen.module.css';
import { characters } from '../data/characters';

interface LoadingScreenProps {
  /** 0 → 1 */
  progress: number;
  /** true once all art has finished preloading */
  ready: boolean;
  /** called when the user presses Play to enter the game */
  onEnter: () => void;
}

export function LoadingScreen({ progress, ready, onEnter }: LoadingScreenProps) {
  const pct = Math.round(progress * 100);
  // When ready, light every friend regardless of rounding.
  const litCount = ready ? characters.length : Math.round(progress * characters.length);

  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <div className={styles.titleRow}>
        <span className={styles.deco}>✿</span>
        <h1 className={styles.title}>Sanrio Memory</h1>
        <span className={styles.deco}>✿</span>
      </div>
      <p className={styles.subtitle}>
        {ready ? '♡ all your friends are here! ♡' : '♡ gathering your friends ♡'}
      </p>

      <div className={styles.avatars}>
        {characters.map((c, i) => (
          <div
            key={c.id}
            className={`${styles.avatar} ${i < litCount ? styles.lit : ''}`}
            style={{ '--accent': c.accent, '--i': i } as React.CSSProperties}
          >
            <img src={c.image} alt="" aria-hidden="true" />
          </div>
        ))}
      </div>

      {ready ? (
        <button type="button" className={styles.enterBtn} onClick={onEnter} autoFocus>
          Tap to Play 🌸
        </button>
      ) : (
        <>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.pct}>{pct}%</span>
        </>
      )}
    </div>
  );
}
