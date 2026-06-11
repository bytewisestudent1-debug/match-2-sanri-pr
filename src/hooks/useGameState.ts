import { useState, useEffect, useCallback, useRef } from 'react';
import { characters } from '../data/characters';
import type { Character } from '../data/characters';

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

function buildDeck(): CardData[] {
  const pairs = [...characters, ...characters];
  return shuffle(pairs).map((character, index) => ({ cardId: index, character }));
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    cards: buildDeck(),
    flippedIds: [],
    matchedIds: [],
    moves: 0,
    seconds: 0,
    gameStarted: false,
    gameWon: false,
  });

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

  const handleCardClick = useCallback((cardId: number) => {
    if (lockedRef.current) return;

    setState(prev => {
      if (prev.flippedIds.includes(cardId)) return prev;
      if (prev.matchedIds.includes(cardId)) return prev;

      const newFlipped = [...prev.flippedIds, cardId];
      const newStarted = !prev.gameStarted ? true : prev.gameStarted;

      if (newFlipped.length < 2) {
        return { ...prev, flippedIds: newFlipped, gameStarted: newStarted };
      }

      // Two cards flipped — check match
      lockedRef.current = true;
      const [firstId, secondId] = newFlipped;
      const firstCard = prev.cards.find(c => c.cardId === firstId)!;
      const secondCard = prev.cards.find(c => c.cardId === secondId)!;
      const isMatch = firstCard.character.id === secondCard.character.id;
      const newMoves = prev.moves + 1;

      if (isMatch) {
        const newMatched = [...prev.matchedIds, firstId, secondId];
        const gameWon = newMatched.length === prev.cards.length;
        lockedRef.current = false;
        return {
          ...prev,
          flippedIds: [],
          matchedIds: newMatched,
          moves: newMoves,
          gameStarted: newStarted,
          gameWon,
        };
      }

      // No match — flip back after delay
      setTimeout(() => {
        setState(s => ({ ...s, flippedIds: [] }));
        lockedRef.current = false;
      }, 900);

      return { ...prev, flippedIds: newFlipped, moves: newMoves, gameStarted: newStarted };
    });
  }, []);

  const resetGame = useCallback(() => {
    lockedRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      cards: buildDeck(),
      flippedIds: [],
      matchedIds: [],
      moves: 0,
      seconds: 0,
      gameStarted: false,
      gameWon: false,
    });
  }, []);

  return { ...state, handleCardClick, resetGame };
}
