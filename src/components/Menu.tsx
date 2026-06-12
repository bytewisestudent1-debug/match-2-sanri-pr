import styles from './Menu.module.css';

export type GameId = 'memory' | 'poker';

interface MenuProps {
  onSelect: (game: GameId) => void;
}

const GAMES: { id: GameId; emoji: string; title: string; blurb: string }[] = [
  { id: 'memory', emoji: '🧠', title: 'Memory Match', blurb: 'Flip & match your Sanrio friends' },
  { id: 'poker',  emoji: '🎴', title: 'Sanrio Poker', blurb: 'Video poker — jacks or better' },
];

export function Menu({ onSelect }: MenuProps) {
  return (
    <div className={styles.menu}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.deco}>✿</span>
          <h1 className={styles.title}>Sanrio Arcade</h1>
          <span className={styles.deco}>✿</span>
        </div>
        <p className={styles.subtitle}>♡ pick a game to play ♡</p>
      </header>

      <div className={styles.cards}>
        {GAMES.map(g => (
          <button key={g.id} type="button" className={styles.card} onClick={() => onSelect(g.id)}>
            <span className={styles.emoji}>{g.emoji}</span>
            <span className={styles.cardTitle}>{g.title}</span>
            <span className={styles.blurb}>{g.blurb}</span>
            <span className={styles.play}>Play ♡</span>
          </button>
        ))}
      </div>
    </div>
  );
}
