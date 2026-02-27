import { useState, useCallback } from 'react';
import { GameState, CategoryId } from '../types';
import { generateCard } from '../lib/cardGenerator';
import { checkForBingo, countFilled } from '../lib/bingoChecker';
import { detectWordsWithAliases } from '../lib/wordDetector';

const INITIAL_STATE: GameState = {
  status: 'idle',
  category: null,
  card: null,
  isListening: false,
  startedAt: null,
  completedAt: null,
  winningLine: null,
  winningWord: null,
  filledCount: 0,
};

export function useGame() {
  const [game, setGame] = useState<GameState>(INITIAL_STATE);
  const [detectedWords, setDetectedWords] = useState<string[]>([]);

  const startGame = useCallback((categoryId: CategoryId) => {
    const card = generateCard(categoryId);
    setGame({
      status: 'playing',
      category: categoryId,
      card,
      isListening: false,
      startedAt: Date.now(),
      completedAt: null,
      winningLine: null,
      winningWord: null,
      filledCount: 1, // Free space
    });
    setDetectedWords([]);
  }, []);

  const toggleSquare = useCallback((row: number, col: number) => {
    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;
      const square = prev.card.squares[row][col];
      if (square.isFreeSpace) return prev;

      const newSquares = prev.card.squares.map((r, ri) =>
        r.map((s, ci) => {
          if (ri === row && ci === col) {
            return {
              ...s,
              isFilled: !s.isFilled,
              filledAt: !s.isFilled ? Date.now() : null,
            };
          }
          return s;
        }),
      );

      const newCard = { ...prev.card, squares: newSquares };
      const winningLine = checkForBingo(newCard);
      const filled = countFilled(newCard);

      if (winningLine) {
        return {
          ...prev,
          card: newCard,
          status: 'won',
          completedAt: Date.now(),
          winningLine,
          winningWord: square.word,
          filledCount: filled,
        };
      }

      return { ...prev, card: newCard, filledCount: filled };
    });
  }, []);

  const processTranscript = useCallback((transcript: string) => {
    setGame(prev => {
      if (!prev.card || prev.status !== 'playing') return prev;

      const alreadyFilled = new Set(
        prev.card.squares.flat()
          .filter(s => s.isFilled && !s.isFreeSpace)
          .map(s => s.word.toLowerCase()),
      );

      const detected = detectWordsWithAliases(transcript, prev.card.words, alreadyFilled);
      if (detected.length === 0) return prev;

      const detectedLower = new Set(detected.map(w => w.toLowerCase()));
      let lastFilledWord = '';

      const newSquares = prev.card.squares.map(row =>
        row.map(s => {
          if (detectedLower.has(s.word.toLowerCase()) && !s.isFilled) {
            lastFilledWord = s.word;
            return {
              ...s,
              isFilled: true,
              isAutoFilled: true,
              filledAt: Date.now(),
            };
          }
          return s;
        }),
      );

      const newCard = { ...prev.card, squares: newSquares };
      const winningLine = checkForBingo(newCard);
      const filled = countFilled(newCard);

      setDetectedWords(prev => [...prev, ...detected]);

      if (winningLine) {
        return {
          ...prev,
          card: newCard,
          status: 'won',
          completedAt: Date.now(),
          winningLine,
          winningWord: lastFilledWord,
          filledCount: filled,
        };
      }

      return { ...prev, card: newCard, filledCount: filled };
    });
  }, []);

  const newCard = useCallback(() => {
    if (game.category) {
      startGame(game.category);
    }
  }, [game.category, startGame]);

  const reset = useCallback(() => {
    setGame(INITIAL_STATE);
    setDetectedWords([]);
  }, []);

  return {
    game,
    setGame,
    detectedWords,
    startGame,
    toggleSquare,
    processTranscript,
    newCard,
    reset,
  };
}
