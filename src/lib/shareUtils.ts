import { GameState } from '../types';
import { CATEGORIES } from '../data/categories';

/** Generate shareable text summary */
export function generateShareText(game: GameState): string {
  const category = CATEGORIES.find(c => c.id === game.category);
  const duration = game.startedAt && game.completedAt
    ? Math.round((game.completedAt - game.startedAt) / 60000)
    : 0;

  return [
    '🎯 Meeting Bingo!',
    '',
    `📦 Pack: ${category?.name ?? 'Unknown'}`,
    `⏱️ Time to BINGO: ${duration} minutes`,
    `🏆 Winning word: "${game.winningWord}"`,
    `📊 Squares filled: ${game.filledCount}/24`,
    '',
    'Play Meeting Bingo!',
  ].join('\n');
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
