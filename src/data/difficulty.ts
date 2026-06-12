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
