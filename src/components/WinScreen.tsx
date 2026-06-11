import styles from './WinScreen.module.css';

interface WinScreenProps {
  moves: number;
  seconds: number;
  onPlayAgain: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function WinScreen({ moves, seconds, onPlayAgain }: WinScreenProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.confetti}>🎉</div>
        <h2 className={styles.title}>You matched them all!</h2>
        <p className={styles.subtitle}>Sanrio is proud of you ✨</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{moves}</span>
            <span className={styles.statLabel}>moves</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatTime(seconds)}</span>
            <span className={styles.statLabel}>time</span>
          </div>
        </div>
        <button className={styles.playAgain} onClick={onPlayAgain}>
          Play Again 🌸
        </button>
      </div>
    </div>
  );
}
