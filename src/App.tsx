import { useState, useCallback } from 'react';
import { CategoryId } from './types';
import { useGame } from './hooks/useGame';
import { useBingoDetection } from './hooks/useBingoDetection';
import { LandingPage } from './components/LandingPage';
import { CategorySelect } from './components/CategorySelect';
import { GameBoard } from './components/GameBoard';
import { WinScreen } from './components/WinScreen';

type Screen = 'landing' | 'category' | 'game' | 'win';

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const { game, detectedWords, startGame, toggleSquare, processTranscript, newCard, reset } = useGame();

  const handleCategorySelect = useCallback((categoryId: CategoryId) => {
    startGame(categoryId);
    setScreen('game');
  }, [startGame]);

  const handleWin = useCallback(() => {
    setScreen('win');
  }, []);

  useBingoDetection(game, handleWin);

  return (
    <div className="min-h-screen bg-gray-50">
      {screen === 'landing' && (
        <LandingPage onStart={() => setScreen('category')} />
      )}
      {screen === 'category' && (
        <CategorySelect
          onSelect={handleCategorySelect}
          onBack={() => setScreen('landing')}
        />
      )}
      {screen === 'game' && game.card && (
        <GameBoard
          game={game}
          detectedWords={detectedWords}
          onSquareClick={toggleSquare}
          onProcessTranscript={processTranscript}
          onNewCard={newCard}
        />
      )}
      {screen === 'win' && (
        <WinScreen
          game={game}
          onPlayAgain={() => {
            if (game.category) {
              startGame(game.category);
              setScreen('game');
            }
          }}
          onHome={() => {
            reset();
            setScreen('landing');
          }}
        />
      )}
    </div>
  );
}
