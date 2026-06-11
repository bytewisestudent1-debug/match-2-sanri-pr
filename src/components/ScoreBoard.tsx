import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  moves: number;
  seconds: number;
  onReset: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function ScoreBoard({ moves, seconds, onReset }: ScoreBoardProps) {
  return (
    <div className={styles.board}>
      <div className={styles.stat}>
        <span className={styles.value}>{moves}</span>
        <span className={styles.label}>moves</span>
      </div>
      <button className={styles.resetBtn} onClick={onReset} aria-label="Reset game">
        ↺ reset
      </button>
      <div className={styles.stat}>
        <span className={styles.value}>{formatTime(seconds)}</span>
        <span className={styles.label}>time</span>
      </div>
    </div>
  );
}
