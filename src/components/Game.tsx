import { useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import type { Difficulty } from '../data/difficulty';
import type { BestScore, RecordResult } from '../hooks/useBestScores';
import { GameBoard } from './GameBoard';
import { ScoreBoard } from './ScoreBoard';
import { WinScreen } from './WinScreen';
import styles from '../App.module.css';

interface GameProps {
  difficulty: Difficulty;
  best?: BestScore;
  recordResult: (moves: number, seconds: number) => RecordResult;
}

export function Game({ difficulty, best, recordResult }: GameProps) {
  const [winRecord, setWinRecord] = useState<RecordResult | undefined>();

  const { cards, flippedIds, matchedIds, moves, seconds, gameWon, handleCardClick, resetGame } =
    useGameState(difficulty.pairs, (m, s) => setWinRecord(recordResult(m, s)));

  const handleReset = () => {
    setWinRecord(undefined);
    resetGame();
  };

  return (
    <>
      <ScoreBoard moves={moves} seconds={seconds} best={best} onReset={handleReset} />
      <GameBoard
        cards={cards}
        flippedIds={flippedIds}
        matchedIds={matchedIds}
        columns={difficulty.columns}
        onCardClick={handleCardClick}
      />

      <footer className={styles.footer}>
        <span>✦ {matchedIds.length / 2} / {difficulty.pairs} pairs matched ✦</span>
      </footer>

      {/* Screen-reader progress announcer */}
      <div className={styles.srOnly} role="status" aria-live="polite">
        {gameWon
          ? `You won in ${moves} moves!`
          : `${matchedIds.length / 2} of ${difficulty.pairs} pairs matched`}
      </div>

      {gameWon && (
        <WinScreen
          moves={moves}
          seconds={seconds}
          pairs={difficulty.pairs}
          record={winRecord}
          onPlayAgain={handleReset}
        />
      )}
    </>
  );
}
