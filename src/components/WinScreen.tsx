import styles from './WinScreen.module.css';
import { formatTime } from '../utils/format';
import { starRating } from '../data/difficulty';
import type { RecordResult } from '../hooks/useBestScores';

interface WinScreenProps {
  moves: number;
  seconds: number;
  pairs: number;
  record?: RecordResult;
  onPlayAgain: () => void;
}

// Static confetti pieces (varied by index so render stays deterministic).
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i % 10) * 0.12,
  duration: 2.4 + (i % 5) * 0.4,
  symbol: ['✿', '♡', '★', '✦', '♪'][i % 5],
}));

const STAR_LABEL = ['', 'Nice!', 'Great!', 'Perfect!'];

export function WinScreen({ moves, seconds, pairs, record, onPlayAgain }: WinScreenProps) {
  const stars = starRating(moves, pairs);

  return (
    <div className={styles.overlay}>
      {/* Confetti rain */}
      <div className={styles.confettiField} aria-hidden="true">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className={styles.piece}
            style={{
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            } as React.CSSProperties}
          >
            {c.symbol}
          </span>
        ))}
      </div>

      <div className={styles.modal}>
        <div className={styles.confetti}>🎉</div>
        <h2 className={styles.title}>You matched them all!</h2>

        <div className={styles.stars} aria-label={`${stars} out of 3 stars`}>
          {[1, 2, 3].map(n => (
            <span
              key={n}
              className={`${styles.star} ${n <= stars ? styles.starOn : ''}`}
              style={{ '--n': n } as React.CSSProperties}
            >
              ★
            </span>
          ))}
        </div>
        <p className={styles.subtitle}>{STAR_LABEL[stars]} Sanrio is proud of you ✨</p>

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
