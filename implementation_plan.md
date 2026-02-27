# Meeting Bingo — Implementation Plan

## Context

The project has three detailed specification docs (PRD, Architecture, UXR) defining a browser-based bingo game that auto-detects meeting buzzwords via the Web Speech API. The current repo is an empty shell with only `@linear/sdk` installed. We need to scaffold a full React + TypeScript + Tailwind app and implement the MVP in 4 phases.

A Linear project "Meeting Bingo" (Planned) has been created at: https://linear.app/claude-code-foundations-maven/project/meeting-bingo-7ec6dc381b22

## Approach

Initialize a Vite + React + TypeScript project **in the repo root**, install dependencies, and build the app following the architecture doc's file structure and code patterns exactly.

---

## Phase 1: Project Setup & Foundation

### 1.1 Initialize Vite project in-place
- Scaffold with `npm create vite@latest . -- --template react-ts` (or manually create config files since repo already exists)
- Install dependencies: `react`, `react-dom`, `canvas-confetti`
- Install dev deps: `tailwindcss`, `postcss`, `autoprefixer`, `@types/canvas-confetti`, `vite`, `@vitejs/plugin-react`, `typescript`

### 1.2 Config files
- `vite.config.ts` — per architecture doc
- `tailwind.config.js` — with custom animations (bounceIn, pulse-fast)
- `postcss.config.js`
- `tsconfig.json`
- `index.html`
- `src/index.css` — Tailwind directives

### 1.3 Core types & data
- `src/types/index.ts` — all interfaces from architecture doc
- `src/data/categories.ts` — 3 buzzword packs (45+ words each)

**Files created**: ~10 config/setup files, 2 source files

---

## Phase 2: Core Game Logic & Components

### 2.1 Library functions
- `src/lib/cardGenerator.ts` — Fisher-Yates shuffle, 5x5 grid generation, free space center
- `src/lib/bingoChecker.ts` — check rows/cols/diagonals, count filled, closest-to-win
- `src/lib/wordDetector.ts` — regex word matching, phrase matching, alias support
- `src/lib/shareUtils.ts` — clipboard share text generation
- `src/lib/utils.ts` — `cn()` classname helper

### 2.2 UI Components
- `src/components/LandingPage.tsx` — hero, "New Game" CTA, how-it-works
- `src/components/CategorySelect.tsx` — 3 category cards with preview words
- `src/components/BingoCard.tsx` — 5x5 CSS grid container
- `src/components/BingoSquare.tsx` — individual square with fill states, animations
- `src/components/GameBoard.tsx` — main game screen (header, card, transcript, controls)
- `src/components/GameControls.tsx` — new card, listening toggle buttons
- `src/components/TranscriptPanel.tsx` — live transcript + detected words display
- `src/components/WinScreen.tsx` — confetti, stats, share button
- `src/components/ui/Button.tsx` — shared button component
- `src/components/ui/Toast.tsx` — notification toasts

### 2.3 App shell
- `src/main.tsx` — entry point
- `src/App.tsx` — screen routing (landing → category → game → win)

**Files created**: ~15 source files

---

## Phase 3: Speech Recognition & Game Hooks

### 3.1 Custom hooks
- `src/hooks/useSpeechRecognition.ts` — Web Speech API wrapper with auto-restart, error handling, interim results
- `src/hooks/useGame.ts` — game state management, square toggle, auto-fill wiring, win detection
- `src/hooks/useBingoDetection.ts` — win condition checking on every fill
- `src/hooks/useLocalStorage.ts` — persistence helper

### 3.2 Wire everything together
- GameBoard uses `useSpeechRecognition` + `useGame`
- On transcript result → run `detectWords` → auto-fill matching squares → check bingo
- Manual tap toggles square → check bingo
- Win triggers transition to WinScreen with confetti

**Files created**: 4 hook files

---

## Phase 4: Polish & Linear Issues

### 4.1 Visual polish
- Responsive layout (mobile-friendly grid)
- Color system per PRD (filled=blue, free=amber, winning=green)
- Auto-fill pulse animation
- Confetti on win via `canvas-confetti`
- "One away!" indicator

### 4.2 Create Linear issues
Create issues in the Meeting Bingo project for the 4 epics from the PRD:
1. **Epic 1: Game Setup** — landing page, category selection, card generation
2. **Epic 2: Audio Transcription** — mic permissions, Web Speech API, auto-fill detection
3. **Epic 3: Gameplay** — manual toggle, progress tracking, bingo detection
4. **Epic 4: Win State & Sharing** — celebration, result summary, share functionality

---

## Verification

1. `npm run dev` — app starts on localhost:3000
2. Landing page loads → click "New Game" → select category → card renders with 24 words + free center
3. Click squares manually → squares toggle → bingo detection fires on 5-in-a-row
4. Enable mic → speak buzzwords → squares auto-fill → transcript panel shows detected words
5. Win → confetti plays → stats display → share copies text to clipboard
6. `npm run build` — builds without TypeScript errors
