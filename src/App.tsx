import { useState } from 'react';
import { useImagePreloader } from './hooks/useImagePreloader';
import { Menu } from './components/Menu';
import type { GameId } from './components/Menu';
import { MemoryGame } from './components/MemoryGame';
import { PokerGame } from './components/PokerGame';
import { SoundToggle } from './components/SoundToggle';
import { LoadingScreen } from './components/LoadingScreen';
import { characters } from './data/characters';
import styles from './App.module.css';

const floaties = [
  { symbol: '✿', duration: 11 }, { symbol: '♡', duration: 14 },
  { symbol: '★', duration: 9  }, { symbol: '✦', duration: 16 },
  { symbol: '♪', duration: 13 }, { symbol: '✿', duration: 10 },
  { symbol: '♡', duration: 15 }, { symbol: '✧', duration: 8  },
  { symbol: '◎', duration: 12 }, { symbol: '♡', duration: 17 },
  { symbol: '✦', duration: 10 }, { symbol: '✿', duration: 13 },
  { symbol: '♬', duration: 11 }, { symbol: '✧', duration: 9  },
  { symbol: '★', duration: 14 }, { symbol: '♡', duration: 7  },
];

// Stable reference so the preloader effect runs once.
const CHARACTER_IMAGES = characters.map(c => c.image);

type Screen = 'menu' | GameId;

function App() {
  const { ready, progress } = useImagePreloader(CHARACTER_IMAGES);
  const [entered, setEntered] = useState(false);
  const [screen, setScreen] = useState<Screen>('menu');

  if (!entered) {
    return <LoadingScreen progress={progress} ready={ready} onEnter={() => setEntered(true)} />;
  }

  return (
    <div className={styles.app}>
      {/* Floating background doodles */}
      <div className={styles.floaties} aria-hidden="true">
        {floaties.map((f, i) => (
          <span
            key={i}
            className={styles.floatie}
            style={{ '--i': i, '--duration': `${f.duration}s` } as React.CSSProperties}
          >
            {f.symbol}
          </span>
        ))}
      </div>

      <SoundToggle />

      <div className={styles.container}>
        {screen === 'menu' && <Menu onSelect={setScreen} />}
        {screen === 'memory' && <MemoryGame onBack={() => setScreen('menu')} />}
        {screen === 'poker' && <PokerGame onBack={() => setScreen('menu')} />}
      </div>
    </div>
  );
}

export default App;
