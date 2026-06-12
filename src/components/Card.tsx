import type { CardData } from '../hooks/useGameState';
import styles from './Card.module.css';

interface CardProps {
  card: CardData;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (cardId: number) => void;
}

export function Card({ card, isFlipped, isMatched, onClick }: CardProps) {
  const { character } = card;
  const revealed = isFlipped || isMatched;

  return (
    <button
      type="button"
      className={`${styles.cardWrapper} ${isMatched ? styles.matched : ''}`}
      onClick={() => !isFlipped && !isMatched && onClick(card.cardId)}
      disabled={isMatched}
      aria-label={revealed ? character.name : 'Hidden card'}
      aria-pressed={revealed}
      style={{ '--accent': character.accent } as React.CSSProperties}
    >
      <div className={`${styles.cardInner} ${isFlipped || isMatched ? styles.flipped : ''}`}>
        {/* Back */}
        <div className={styles.cardBack}>
          <div className={styles.dots} />
          <div className={styles.backInner}>
            <div className={styles.corners}>
              <span className={styles.corner}>✿</span>
              <span className={styles.corner}>✿</span>
              <span className={styles.corner}>✿</span>
              <span className={styles.corner}>✿</span>
            </div>
            <span className={styles.bow}>✿</span>
            <span className={styles.hearts}>♡ ♡ ♡</span>
          </div>
        </div>

        {/* Front */}
        <div className={styles.cardFront}>
          <img
            src={character.image}
            alt={character.name}
            className={styles.characterImg}
          />
          <span className={styles.name}>{character.name}</span>
          {isMatched && <div className={styles.matchGlow} />}
        </div>
      </div>
    </button>
  );
}
