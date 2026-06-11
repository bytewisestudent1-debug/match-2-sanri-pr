import { useGameState } from './hooks/useGameState';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { WinScreen } from './components/WinScreen';
import styles from './App.module.css';

const floaties = ['✿', '♡', '★', '✦', '♪', '✿', '♡', '✧', '◎', '♡'];

function App() {
  const { cards, flippedIds, matchedIds, moves, seconds, gameWon, handleCardClick, resetGame } =
    useGameState();

  return (
    <div className={styles.app}>
      {/* Floating background doodles */}
      <div className={styles.floaties} aria-hidden="true">
        {floaties.map((symbol, i) => (
          <span key={i} className={styles.floatie} style={{ '--i': i } as React.CSSProperties}>
            {symbol}
          </span>
        ))}
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <span className={styles.titleDeco}>✿</span>
            <h1 className={styles.title}>Sanrio Memory</h1>
            <span className={styles.titleDeco}>✿</span>
          </div>
          <p className={styles.subtitle}>♡ match all your sanrio friends ♡</p>
        </header>

        <ScoreBoard moves={moves} seconds={seconds} onReset={resetGame} />
        <GameBoard
          cards={cards}
          flippedIds={flippedIds}
          matchedIds={matchedIds}
          onCardClick={handleCardClick}
        />

        <footer className={styles.footer}>
          <span>✦ {matchedIds.length / 2} / 8 pairs matched ✦</span>
        </footer>
      </div>

      {gameWon && (
        <WinScreen moves={moves} seconds={seconds} onPlayAgain={resetGame} />
      )}
    </div>
  );
}

export default App;
