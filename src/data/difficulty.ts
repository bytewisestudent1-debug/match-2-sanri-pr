export type DifficultyId = 'easy' | 'medium' | 'hard';

export type Difficulty = {
  id: DifficultyId;
  label: string;
  /** Number of matching pairs in the deck (deck size = pairs * 2). */
  pairs: number;
  /** Number of grid columns to lay the cards out in. */
  columns: number;
};

export const DIFFICULTIES: Difficulty[] = [
  { id: 'easy',   label: 'Easy',   pairs: 4, columns: 4 },
  { id: 'medium', label: 'Medium', pairs: 6, columns: 4 },
  { id: 'hard',   label: 'Hard',   pairs: 8, columns: 4 },
];

export const DEFAULT_DIFFICULTY: DifficultyId = 'medium';

export function getDifficulty(id: DifficultyId): Difficulty {
  return DIFFICULTIES.find(d => d.id === id) ?? DIFFICULTIES[1];
}

/**
 * Rate a finished game 1–3 stars by efficiency. The fewest possible moves is
 * `pairs` (a perfect memory), so thresholds scale with the board size.
 */
export function starRating(moves: number, pairs: number): number {
  if (moves <= pairs * 1.6) return 3;
  if (moves <= pairs * 2.4) return 2;
  return 1;
}
