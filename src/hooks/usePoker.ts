import { useEffect, useState } from 'react';
import { freshDeck, evaluateHand } from '../utils/poker';
import type { PlayingCard, HandResult } from '../utils/poker';
import { playSound } from '../utils/sound';

export type PokerPhase = 'idle' | 'dealt' | 'result';

export const START_CREDITS = 100;
export const MIN_BET = 1;
export const MAX_BET = 5;

const CREDITS_KEY = 'sanrio-poker:credits';

function loadCredits(): number {
  try {
    const raw = localStorage.getItem(CREDITS_KEY);
    if (raw !== null) {
      const n = Number(raw);
      if (Number.isFinite(n) && n >= 0) return Math.floor(n);
    }
  } catch {
    /* ignore */
  }
  return START_CREDITS;
}

export function usePoker() {
  const [credits, setCredits] = useState<number>(loadCredits);
  const [bet, setBet] = useState(1);
  const [hand, setHand] = useState<PlayingCard[]>([]);
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [holds, setHolds] = useState<boolean[]>([false, false, false, false, false]);
  const [phase, setPhase] = useState<PokerPhase>('idle');
  const [result, setResult] = useState<HandResult | null>(null);
  const [lastWin, setLastWin] = useState(0);

  // Persist credits whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(CREDITS_KEY, String(credits));
    } catch {
      /* ignore */
    }
  }, [credits]);

  const canDeal = (phase === 'idle' || phase === 'result') && credits >= bet;

  const changeBet = (next: number) => {
    if (phase === 'dealt') return; // can't change mid-hand
    setBet(Math.max(MIN_BET, Math.min(MAX_BET, next)));
  };

  const deal = () => {
    if (!canDeal) return;
    const d = freshDeck();
    setHand(d.slice(0, 5));
    setDeck(d.slice(5));
    setHolds([false, false, false, false, false]);
    setCredits(c => c - bet);
    setResult(null);
    setLastWin(0);
    setPhase('dealt');
    playSound('flip');
  };

  const toggleHold = (index: number) => {
    if (phase !== 'dealt') return;
    setHolds(h => h.map((held, i) => (i === index ? !held : held)));
    playSound('flip');
  };

  const draw = () => {
    if (phase !== 'dealt') return;
    const pile = [...deck];
    const newHand = hand.map((card, i) => (holds[i] ? card : pile.shift()!));
    const evald = evaluateHand(newHand);
    const win = evald.payout * bet;
    setHand(newHand);
    setResult(evald);
    setLastWin(win);
    setPhase('result');
    if (win > 0) {
      setCredits(c => c + win);
      playSound('win');
    } else {
      playSound('mismatch');
    }
  };

  const refill = () => {
    setCredits(START_CREDITS);
    setPhase('idle');
    setHand([]);
    setResult(null);
    setLastWin(0);
  };

  return {
    credits,
    bet,
    hand,
    holds,
    phase,
    result,
    lastWin,
    canDeal,
    isBroke: credits < MIN_BET && phase !== 'dealt',
    changeBet,
    deal,
    toggleHold,
    draw,
    refill,
  };
}
