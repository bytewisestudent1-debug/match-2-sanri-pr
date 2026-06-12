# 🎀 Sanrio Arcade

A cute Sanrio-themed mini-game arcade. Press play, then pick a game from the menu:

- **🧠 Memory Match** — flip two cards; if they match they stay, if not they flip
  back. Clear the whole board to win.
- **🎴 Sanrio Poker** — single-player video poker (Jacks or Better). Deal five
  cards, hold the ones you want, draw once, and get paid by hand rank.

## ✨ Features

### Shared
- **Themed loading screen** — preloads all character art (so cards never pop in
  mid-game) while friends light up one by one, then a Play button to enter
- **Sound effects** — chimes generated with the Web Audio API (no audio files),
  with a mute toggle that remembers your choice
- **Polished UI** — animated gradient background, floating doodles, keyboard
  accessibility, and `prefers-reduced-motion` support throughout

### Memory Match
- **Three difficulty levels** — Easy (4 pairs), Medium (6 pairs), Hard (8 pairs)
- **Best-score tracking** — your fewest moves and fastest time are saved per
  difficulty in `localStorage` and celebrated with a ★ badge when you beat them
- 3D card flips and a confetti win screen

### Sanrio Poker
- Full Jacks-or-Better hand evaluation with a classic 9/6 paytable
- Adjustable bet, hold/draw mechanics, and persistent chip balance
  (auto-refill when you run out)

## 🧱 Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev/build
- CSS Modules for styling (no UI framework)

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check and build for production
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## 📁 Project structure

```
src/
├── App.tsx                  # loading → menu → game routing
├── components/
│   ├── Menu.tsx             # home screen: pick a game
│   ├── LoadingScreen.tsx    # themed asset-preloading splash + Play button
│   ├── BackButton.tsx       # shared "← menu" button
│   ├── SoundToggle.tsx      # mute / unmute button
│   │  # — Memory Match —
│   ├── MemoryGame.tsx       # memory screen (difficulty + board wiring)
│   ├── Game.tsx             # a single memory round
│   ├── Card.tsx             # a flip card (accessible button)
│   ├── GameBoard.tsx        # responsive card grid
│   ├── ScoreBoard.tsx       # moves / time / best score + reset
│   ├── DifficultyPicker.tsx # Easy / Medium / Hard selector
│   ├── WinScreen.tsx        # victory modal with new-record badges
│   │  # — Sanrio Poker —
│   ├── PokerGame.tsx        # video poker screen
│   └── PlayingCard.tsx      # a standard playing card
├── hooks/
│   ├── useGameState.ts      # memory logic (deck, flips, matching, timer)
│   ├── useBestScores.ts     # persistent best-score tracking
│   ├── useImagePreloader.ts # preloads character art, reports progress
│   └── usePoker.ts          # poker logic + persistent chip balance
├── data/
│   ├── characters.ts        # the Sanrio characters
│   └── difficulty.ts        # memory difficulty definitions
└── utils/
    ├── format.ts            # mm:ss time formatting
    ├── sound.ts             # Web Audio sound engine
    └── poker.ts             # deck + Jacks-or-Better hand evaluation
```

## 🎨 Characters

Hello Kitty · My Melody · Cinnamoroll · Kuromi · Keroppi · Pochacco ·
Tuxedo Sam · Chococat
