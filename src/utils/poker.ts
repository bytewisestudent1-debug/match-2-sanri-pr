/** Standard 52-card poker deck + Jacks-or-Better hand evaluation. */

export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';

/** Rank 2–10, then 11=J, 12=Q, 13=K, 14=A. */
export type PlayingCard = {
  id: string;
  rank: number;
  suit: Suit;
};

export const SUIT_SYMBOL: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds';
}

export function rankLabel(rank: number): string {
  switch (rank) {
    case 14: return 'A';
    case 13: return 'K';
    case 12: return 'Q';
    case 11: return 'J';
    default: return String(rank);
  }
}

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function freshDeck(): PlayingCard[] {
  const deck: PlayingCard[] = [];
  for (const suit of SUITS) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ id: `${rank}-${suit}`, rank, suit });
    }
  }
  return shuffle(deck);
}

export type HandKey =
  | 'royal'
  | 'straight-flush'
  | 'four'
  | 'full-house'
  | 'flush'
  | 'straight'
  | 'three'
  | 'two-pair'
  | 'jacks'
  | 'nothing';

export type PayoutRow = {
  key: HandKey;
  label: string;
  /** Payout multiplier per credit bet. */
  payout: number;
};

/** Classic 9/6 Jacks-or-Better paytable (multiplier per credit bet). */
export const PAYTABLE: PayoutRow[] = [
  { key: 'royal',          label: 'Royal Flush',     payout: 250 },
  { key: 'straight-flush', label: 'Straight Flush',  payout: 50 },
  { key: 'four',           label: 'Four of a Kind',  payout: 25 },
  { key: 'full-house',     label: 'Full House',      payout: 9 },
  { key: 'flush',          label: 'Flush',           payout: 6 },
  { key: 'straight',       label: 'Straight',        payout: 4 },
  { key: 'three',          label: 'Three of a Kind', payout: 3 },
  { key: 'two-pair',       label: 'Two Pair',        payout: 2 },
  { key: 'jacks',          label: 'Jacks or Better', payout: 1 },
];

const PAYOUT_BY_KEY = new Map(PAYTABLE.map(r => [r.key, r]));

export type HandResult = {
  key: HandKey;
  label: string;
  /** Payout multiplier per credit bet (0 for a losing hand). */
  payout: number;
};

const NOTHING: HandResult = { key: 'nothing', label: 'No Win', payout: 0 };

function result(key: HandKey): HandResult {
  const row = PAYOUT_BY_KEY.get(key);
  return row ? { key, label: row.label, payout: row.payout } : NOTHING;
}

/** Evaluate a 5-card hand under Jacks-or-Better rules. */
export function evaluateHand(cards: PlayingCard[]): HandResult {
  if (cards.length !== 5) return NOTHING;

  const ranks = cards.map(c => c.rank).sort((a, b) => a - b);
  const suits = cards.map(c => c.suit);
  const isFlush = suits.every(s => s === suits[0]);

  const unique = [...new Set(ranks)];
  let isStraight = false;
  let straightHigh = 0;
  if (unique.length === 5) {
    if (ranks[4] - ranks[0] === 4) {
      isStraight = true;
      straightHigh = ranks[4];
    } else if (ranks.join(',') === '2,3,4,5,14') {
      // Ace-low "wheel" straight: A-2-3-4-5.
      isStraight = true;
      straightHigh = 5;
    }
  }

  const counts: Record<number, number> = {};
  for (const r of ranks) counts[r] = (counts[r] ?? 0) + 1;
  const countValues = Object.values(counts).sort((a, b) => b - a);

  if (isStraight && isFlush && straightHigh === 14) return result('royal');
  if (isStraight && isFlush) return result('straight-flush');
  if (countValues[0] === 4) return result('four');
  if (countValues[0] === 3 && countValues[1] === 2) return result('full-house');
  if (isFlush) return result('flush');
  if (isStraight) return result('straight');
  if (countValues[0] === 3) return result('three');
  if (countValues[0] === 2 && countValues[1] === 2) return result('two-pair');
  if (countValues[0] === 2) {
    const pairRank = Number(
      Object.keys(counts).find(r => counts[Number(r)] === 2),
    );
    return pairRank >= 11 ? result('jacks') : NOTHING;
  }
  return NOTHING;
}
