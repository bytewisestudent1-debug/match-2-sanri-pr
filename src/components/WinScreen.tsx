import styles from './WinScreen.module.css';
import { formatTime } from '../utils/format';
import type { RecordResult } from '../hooks/useBestScores';

interface WinScreenProps {
  moves: number;
  seconds: number;
  record?: RecordResult;
  onPlayAgain: () => void;
}

export function WinScreen({ moves, seconds, record, onPlayAgain }: WinScreenProps) {
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
            {record?.newBestMoves && <span className={styles.badge}>★ best</span>}
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{formatTime(seconds)}</span>
            <span className={styles.statLabel}>time</span>
            {record?.newBestTime && <span className={styles.badge}>★ best</span>}
          </div>
        </div>
        <button className={styles.playAgain} onClick={onPlayAgain}>
          Play Again 🌸
        </button>
      </div>
    </div>
  );
}
