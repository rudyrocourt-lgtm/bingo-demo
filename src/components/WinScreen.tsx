import { useEffect, useCallback, useState } from 'react';
import confetti from 'canvas-confetti';
import { GameState } from '../types';
import { CATEGORIES } from '../data/categories';
import { generateShareText, copyToClipboard } from '../lib/shareUtils';
import { BingoCard } from './BingoCard';
import { Button } from './ui/Button';

interface Props {
  game: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function WinScreen({ game, onPlayAgain, onHome }: Props) {
  const [copied, setCopied] = useState(false);
  const category = CATEGORIES.find(c => c.id === game.category);

  const duration = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 60000)
    : 0;

  useEffect(() => {
    const end = Date.now() + 2000;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const handleShare = useCallback(async () => {
    const text = generateShareText(game);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [game]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-[bounceIn_0.5s_ease-out]">
        🎉🎊 BINGO! 🎊🎉
      </h1>

      {game.card && (
        <div className="w-full max-w-md mb-6">
          <BingoCard
            card={game.card}
            winningLine={game.winningLine}
            onSquareClick={() => {}}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-sm w-full mb-6 space-y-2 text-center">
        <p className="text-gray-600">
          📦 Pack: <span className="font-semibold">{category?.name}</span>
        </p>
        <p className="text-gray-600">
          ⏱️ Time to BINGO: <span className="font-semibold">{duration} minutes</span>
        </p>
        <p className="text-gray-600">
          🏆 Winning word: <span className="font-semibold">"{game.winningWord}"</span>
        </p>
        <p className="text-gray-600">
          📊 Squares filled: <span className="font-semibold">{game.filledCount}/24</span>
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleShare}>
          {copied ? '✅ Copied!' : '📤 Share Result'}
        </Button>
        <Button onClick={onPlayAgain}>
          🔄 Play Again
        </Button>
      </div>

      <Button variant="ghost" size="sm" onClick={onHome} className="mt-4">
        ← Back to Home
      </Button>
    </div>
  );
}
