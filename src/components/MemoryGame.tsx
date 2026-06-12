import { useState } from 'react';
import { useBestScores } from '../hooks/useBestScores';
import { Game } from './Game';
import { DifficultyPicker } from './DifficultyPicker';
import { BackButton } from './BackButton';
import { DEFAULT_DIFFICULTY, getDifficulty } from '../data/difficulty';
import type { DifficultyId } from '../data/difficulty';
import styles from '../App.module.css';

const DIFFICULTY_KEY = 'sanrio-memory:difficulty';

function loadDifficulty(): DifficultyId {
  try {
    const saved = localStorage.getItem(DIFFICULTY_KEY);
    if (saved === 'easy' || saved === 'medium' || saved === 'hard') return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_DIFFICULTY;
}

interface MemoryGameProps {
  onBack: () => void;
}

export function MemoryGame({ onBack }: MemoryGameProps) {
  const [difficultyId, setDifficultyId] = useState<DifficultyId>(loadDifficulty);
  const difficulty = getDifficulty(difficultyId);
  const { getBest, recordResult } = useBestScores();

  const changeDifficulty = (id: DifficultyId) => {
    setDifficultyId(id);
    try {
      localStorage.setItem(DIFFICULTY_KEY, id);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <BackButton onClick={onBack} />

      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.titleDeco}>✿</span>
          <h1 className={styles.title}>Sanrio Memory</h1>
          <span className={styles.titleDeco}>✿</span>
        </div>
        <p className={styles.subtitle}>♡ match all your sanrio friends ♡</p>
      </header>

      <DifficultyPicker value={difficultyId} onChange={changeDifficulty} />

      {/* key remounts the game (fresh deck) whenever difficulty changes */}
      <Game
        key={difficultyId}
        difficulty={difficulty}
        best={getBest(difficultyId)}
        recordResult={(moves, seconds) => recordResult(difficultyId, moves, seconds)}
      />
    </>
  );
}
