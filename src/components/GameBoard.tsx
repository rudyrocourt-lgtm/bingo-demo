import { useCallback } from 'react';
import { GameState } from '../types';
import { getClosestToWin, countFilled } from '../lib/bingoChecker';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { BingoCard } from './BingoCard';
import { TranscriptPanel } from './TranscriptPanel';
import { GameControls } from './GameControls';
import { cn } from '../lib/utils';

interface Props {
  game: GameState;
  detectedWords: string[];
  onSquareClick: (row: number, col: number) => void;
  onProcessTranscript: (transcript: string) => void;
  onNewCard: () => void;
}

export function GameBoard({ game, detectedWords, onSquareClick, onProcessTranscript, onNewCard }: Props) {
  const speech = useSpeechRecognition();

  const handleToggleListening = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
    } else {
      speech.startListening((transcript) => {
        onProcessTranscript(transcript);
      });
    }
  }, [speech, onProcessTranscript]);

  const closest = game.card ? getClosestToWin(game.card) : null;
  const filled = game.card ? countFilled(game.card) : 0;

  return (
    <div className="min-h-screen flex flex-col px-4 py-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-gray-900">🎯 Meeting Bingo</h1>
        <div className="flex items-center gap-3">
          {speech.isListening && (
            <span className="flex items-center gap-1 text-sm text-red-600">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Listening
            </span>
          )}
          <span className="text-sm text-gray-500 font-medium">{filled - 1}/24</span>
        </div>
      </div>

      {/* One away indicator */}
      {closest && closest.needed === 1 && (
        <div className={cn(
          'text-center py-2 px-4 mb-3 rounded-lg text-sm font-semibold',
          'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse',
        )}>
          ⚡ One away from BINGO!
        </div>
      )}

      {/* Card */}
      {game.card && (
        <BingoCard
          card={game.card}
          winningLine={game.winningLine}
          onSquareClick={onSquareClick}
        />
      )}

      {/* Transcript */}
      <TranscriptPanel
        transcript={speech.transcript}
        interimTranscript={speech.interimTranscript}
        detectedWords={detectedWords}
        isListening={speech.isListening}
      />

      {/* Controls */}
      <GameControls
        isListening={speech.isListening}
        isSpeechSupported={speech.isSupported}
        onToggleListening={handleToggleListening}
        onNewCard={onNewCard}
      />
    </div>
  );
}
