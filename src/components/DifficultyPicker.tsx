import styles from './DifficultyPicker.module.css';
import { DIFFICULTIES } from '../data/difficulty';
import type { DifficultyId } from '../data/difficulty';

interface DifficultyPickerProps {
  value: DifficultyId;
  onChange: (id: DifficultyId) => void;
}

export function DifficultyPicker({ value, onChange }: DifficultyPickerProps) {
  return (
    <div className={styles.picker} role="group" aria-label="Difficulty">
      {DIFFICULTIES.map(d => (
        <button
          key={d.id}
          type="button"
          className={`${styles.option} ${value === d.id ? styles.active : ''}`}
          onClick={() => onChange(d.id)}
          aria-pressed={value === d.id}
        >
          {d.label}
          <span className={styles.count}>{d.pairs} pairs</span>
        </button>
      ))}
    </div>
  );
}
