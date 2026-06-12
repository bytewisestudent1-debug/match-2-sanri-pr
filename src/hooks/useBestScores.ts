import { useCallback, useState } from 'react';
import type { DifficultyId } from '../data/difficulty';

export type BestScore = {
  moves: number;
  seconds: number;
};

type BestScores = Partial<Record<DifficultyId, BestScore>>;

export type RecordResult = {
  newBestMoves: boolean;
  newBestTime: boolean;
};

const STORAGE_KEY = 'sanrio-memory:best-scores';

function load(): BestScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BestScores) : {};
  } catch {
    return {};
  }
}

function save(scores: BestScores): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch {
    /* ignore storage failures */
  }
}

/**
 * Tracks the best (fewest moves / fastest time) result per difficulty,
 * persisted to localStorage. Moves and time are tracked independently so
 * a fast-but-sloppy run and a slow-but-efficient run can each hold a record.
 */
export function useBestScores() {
  const [scores, setScores] = useState<BestScores>(load);

  const recordResult = useCallback(
    (difficulty: DifficultyId, moves: number, seconds: number): RecordResult => {
      const prev = scores[difficulty];
      const newBestMoves = !prev || moves < prev.moves;
      const newBestTime = !prev || seconds < prev.seconds;

      if (newBestMoves || newBestTime) {
        const next: BestScores = {
          ...scores,
          [difficulty]: {
            moves: newBestMoves ? moves : prev!.moves,
            seconds: newBestTime ? seconds : prev!.seconds,
          },
        };
        setScores(next);
        save(next);
      }

      return { newBestMoves, newBestTime };
    },
    [scores],
  );

  const getBest = useCallback(
    (difficulty: DifficultyId): BestScore | undefined => scores[difficulty],
    [scores],
  );

  return { getBest, recordResult };
}
