import { useEffect, useRef } from 'react';
import { GameState } from '../types';

/** Calls onWin when game status transitions to 'won' */
export function useBingoDetection(
  game: GameState,
  onWin: () => void,
) {
  const prevStatus = useRef(game.status);

  useEffect(() => {
    if (prevStatus.current !== 'won' && game.status === 'won') {
      onWin();
    }
    prevStatus.current = game.status;
  }, [game.status, onWin]);
}
