import styles from './PokerGame.module.css';
import { BackButton } from './BackButton';
import { PlayingCard } from './PlayingCard';
import { usePoker, MIN_BET, MAX_BET } from '../hooks/usePoker';
import { PAYTABLE } from '../utils/poker';

const FACE_DOWN = Array.from({ length: 5 });

interface PokerGameProps {
  onBack: () => void;
}

export function PokerGame({ onBack }: PokerGameProps) {
  const {
    credits, bet, hand, holds, phase, result, lastWin, stats,
    canDeal, isBroke, changeBet, deal, toggleHold, draw, refill,
  } = usePoker();

  const showingHand = phase !== 'idle';

  return (
    <div className={styles.poker}>
      <BackButton onClick={onBack} />

      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.deco}>♠</span>
          <h1 className={styles.title}>Sanrio Poker</h1>
          <span className={styles.deco}>♥</span>
        </div>
        <p className={styles.subtitle}>♡ jacks or better ♡</p>
      </header>

      {/* Paytable */}
      <div className={styles.paytable}>
        {PAYTABLE.map(row => (
          <div
            key={row.key}
            className={`${styles.payRow} ${result?.key === row.key ? styles.payRowActive : ''}`}
          >
            <span className={styles.payLabel}>{row.label}</span>
            <span className={styles.payValue}>×{row.payout}</span>
          </div>
        ))}
      </div>

      {/* Result banner */}
      <div className={`${styles.banner} ${phase === 'result' ? (lastWin > 0 ? styles.bannerWin : styles.bannerLose) : ''}`}>
        {phase === 'idle' && 'Place your bet and deal ♠'}
        {phase === 'dealt' && 'Tap cards to HOLD, then Draw ✿'}
        {phase === 'result' && (lastWin > 0
          ? `${result?.label}! +${lastWin} chips ✨`
          : 'No win — try again ♡')}
      </div>

      {/* Hand */}
      <div className={styles.hand}>
        {showingHand
          ? hand.map((card, i) => (
              <PlayingCard
                key={card.id}
                card={card}
                held={holds[i]}
                holdable={phase === 'dealt'}
                onToggleHold={() => toggleHold(i)}
              />
            ))
          : FACE_DOWN.map((_, i) => <PlayingCard key={i} />)}
      </div>

      {/* Controls */}
      {isBroke ? (
        <div className={styles.broke}>
          <p>Out of chips! 🥺</p>
          <button type="button" className={styles.primaryBtn} onClick={refill}>
            Refill 100 chips 🌸
          </button>
        </div>
      ) : (
        <div className={styles.controls}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{credits}</span>
            <span className={styles.statLabel}>chips</span>
          </div>

          <div className={styles.betGroup}>
            <button
              type="button"
              className={styles.betBtn}
              onClick={() => changeBet(bet - 1)}
              disabled={phase === 'dealt' || bet <= MIN_BET}
              aria-label="Decrease bet"
            >
              −
            </button>
            <div className={styles.stat}>
              <span className={styles.statValue}>{bet}</span>
              <span className={styles.statLabel}>bet</span>
            </div>
            <button
              type="button"
              className={styles.betBtn}
              onClick={() => changeBet(bet + 1)}
              disabled={phase === 'dealt' || bet >= MAX_BET}
              aria-label="Increase bet"
            >
              +
            </button>
          </div>

          {phase === 'dealt' ? (
            <button type="button" className={styles.primaryBtn} onClick={draw}>
              Draw 🎴
            </button>
          ) : (
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={deal}
              disabled={!canDeal}
            >
              Deal ♠
            </button>
          )}
        </div>
      )}

      <p className={styles.sessionStats}>
        ♠ {stats.handsPlayed} hands played · biggest win {stats.biggestWin} chips ♥
      </p>
    </div>
  );
}
