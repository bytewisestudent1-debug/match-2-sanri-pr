import styles from './BackButton.module.css';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button type="button" className={styles.back} onClick={onClick} aria-label="Back to menu">
      ← menu
    </button>
  );
}
