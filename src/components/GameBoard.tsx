import type { CardData } from '../hooks/useGameState';
import { Card } from './Card';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  cards: CardData[];
  flippedIds: number[];
  matchedIds: number[];
  columns: number;
  onCardClick: (cardId: number) => void;
}

export function GameBoard({ cards, flippedIds, matchedIds, columns, onCardClick }: GameBoardProps) {
  return (
    <div
      className={styles.grid}
      style={{ '--columns': columns } as React.CSSProperties}
    >
      {cards.map(card => (
        <Card
          key={card.cardId}
          card={card}
          isFlipped={flippedIds.includes(card.cardId)}
          isMatched={matchedIds.includes(card.cardId)}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
