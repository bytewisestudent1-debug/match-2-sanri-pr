import { useState, useEffect, useRef } from 'react';
import { characters } from '../data/characters';
import type { Character } from '../data/characters';
import { playSound } from '../utils/sound';

export type CardData = {
  cardId: number;
  character: Character;
};

type GameState = {
  cards: CardData[];
  flippedIds: number[];
  matchedIds: number[];
  moves: number;
  seconds: number;
  gameStarted: boolean;
  gameWon: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs: number): CardData[] {
  // Pick a random subset of characters so smaller boards stay varied.
  const chosen = shuffle(characters).slice(0, pairs);
  const deck = [...chosen, ...chosen];
  return shuffle(deck).map((character, index) => ({ cardId: index, character }));
}

function initialState(pairs: number): GameState {
  return {
    cards: buildDeck(pairs),
    flippedIds: [],
    matchedIds: [],
    moves: 0,
    seconds: 0,
    gameStarted: false,
    gameWon: false,
  };
}

/**
 * Core memory-game logic. `onWin` fires once with the final moves/seconds
 * when the board is cleared. The board is rebuilt only on resetGame() — to
 * change difficulty, remount this hook's owner with a new React `key`.
 */
export function useGameState(pairs: number, onWin?: (moves: number, seconds: number) => void) {
  const [state, setState] = useState<GameState>(() => initialState(pairs));

  const lockedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.gameStarted && !state.gameWon) {
      timerRef.current = setInterval(() => {
        setState(s => ({ ...s, seconds: s.seconds + 1 }));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.gameStarted, state.gameWon]);

  // Not memoized: re-created each render so it always reads fresh state/onWin.
  // Match resolution is guarded by lockedRef, and clicks are discrete events
  // (state has flushed between them), so reading `state` directly is safe.
  const handleCardClick = (cardId: number) => {
    if (lockedRef.current) return;
    if (state.flippedIds.includes(cardId)) return;
    if (state.matchedIds.includes(cardId)) return;

    playSound('flip');
    const newFlipped = [...state.flippedIds, cardId];

    if (newFlipped.length < 2) {
      setState(s => ({ ...s, flippedIds: newFlipped, gameStarted: true }));
      return;
    }

    // Two cards flipped — check match.
    lockedRef.current = true;
    const [firstId, secondId] = newFlipped;
    const firstCard = state.cards.find(c => c.cardId === firstId)!;
    const secondCard = state.cards.find(c => c.cardId === secondId)!;
    const isMatch = firstCard.character.id === secondCard.character.id;
    const newMoves = state.moves + 1;

    if (isMatch) {
      const newMatched = [...state.matchedIds, firstId, secondId];
      const won = newMatched.length === state.cards.length;
      lockedRef.current = false;
      playSound(won ? 'win' : 'match');
      setState(s => ({
        ...s,
        flippedIds: [],
        matchedIds: newMatched,
        moves: newMoves,
        gameStarted: true,
        gameWon: won,
      }));
      if (won) onWin?.(newMoves, state.seconds);
      return;
    }

    // No match — show both briefly, then flip back.
    setState(s => ({ ...s, flippedIds: newFlipped, moves: newMoves, gameStarted: true }));
    setTimeout(() => {
      playSound('mismatch');
      setState(s => ({ ...s, flippedIds: [] }));
      lockedRef.current = false;
    }, 900);
  };

  const resetGame = () => {
    lockedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    setState(initialState(pairs));
  };

  return { ...state, handleCardClick, resetGame };
}
