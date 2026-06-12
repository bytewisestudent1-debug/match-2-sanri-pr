import styles from './PlayingCard.module.css';
import { SUIT_SYMBOL, isRedSuit, rankLabel } from '../utils/poker';
import type { PlayingCard as Card } from '../utils/poker';

interface PlayingCardProps {
  card?: Card;
  held?: boolean;
  /** When true the card is interactive (deal phase) and shows a HOLD toggle. */
  holdable?: boolean;
  onToggleHold?: () => void;
}

export function PlayingCard({ card, held, holdable, onToggleHold }: PlayingCardProps) {
  const label = card
    ? `${rankLabel(card.rank)} of ${card.suit}${held ? ', held' : ''}`
    : 'Face down card';

  return (
    <div className={styles.slot}>
      <button
        type="button"
        className={`${styles.card} ${card ? '' : styles.faceDown} ${held ? styles.held : ''} ${isRedSuit(card?.suit ?? 'spades') ? styles.red : styles.black}`}
        onClick={holdable ? onToggleHold : undefined}
        disabled={!holdable}
        aria-pressed={holdable ? !!held : undefined}
        aria-label={label}
      >
        {card ? (
          <>
            <span className={styles.cornerTop}>
              <span className={styles.rank}>{rankLabel(card.rank)}</span>
              <span className={styles.suit}>{SUIT_SYMBOL[card.suit]}</span>
            </span>
            <span className={styles.center}>{SUIT_SYMBOL[card.suit]}</span>
            <span className={styles.cornerBottom}>
              <span className={styles.rank}>{rankLabel(card.rank)}</span>
              <span className={styles.suit}>{SUIT_SYMBOL[card.suit]}</span>
            </span>
          </>
        ) : (
          <span className={styles.backDeco}>✿</span>
        )}
      </button>
      <span className={`${styles.holdTag} ${held ? styles.holdTagOn : ''}`}>HOLD</span>
    </div>
  );
}
