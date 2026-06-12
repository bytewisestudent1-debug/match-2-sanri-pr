import styles from './ScoreBoard.module.css';
import { formatTime } from '../utils/format';
import type { BestScore } from '../hooks/useBestScores';

interface ScoreBoardProps {
  moves: number;
  seconds: number;
  best?: BestScore;
  onReset: () => void;
}

export function ScoreBoard({ moves, seconds, best, onReset }: ScoreBoardProps) {
  return (
    <div className={styles.wrapper}>
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
      {best && (
        <p className={styles.best}>
          ★ best: {best.moves} moves · {formatTime(best.seconds)}
        </p>
      )}
    </div>
  );
}
