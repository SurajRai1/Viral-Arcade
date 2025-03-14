'use client';

import { useState, useEffect, useRef } from 'react';
import { addScore } from '@/lib/supabase';

interface GameAreaProps {
  isRageMode?: boolean;
  onGameComplete?: (score: number) => void;
}

export default function GameArea({ isRageMode = false, onGameComplete }: GameAreaProps) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [obstacles, setObstacles] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const obstaclesTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle game start with countdown
  const startGame = () => {
    setGameState('ready');
    setScore(0);
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setGameState('playing');
          
          // Start the game timer (1 second)
          timerRef.current = setTimeout(() => {
            endGame();
          }, 1000);
          
          // If rage mode, generate obstacles
          if (isRageMode) {
            generateObstacles();
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Generate obstacles for rage mode
  const generateObstacles = () => {
    if (!gameAreaRef.current) return;
    
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    
    obstaclesTimerRef.current = setInterval(() => {
      setObstacles((prev) => {
        // Add a new obstacle every 200ms
        const newObstacle = {
          id: Date.now(),
          x: Math.random() * (width - 40),
          y: Math.random() * (height - 40)
        };
        return [...prev, newObstacle];
      });
    }, 200);
  };

  // Handle game end
  const endGame = () => {
    setGameState('finished');
    setShowNameInput(true);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (obstaclesTimerRef.current) {
      clearInterval(obstaclesTimerRef.current);
      setObstacles([]);
    }
    
    if (onGameComplete) {
      onGameComplete(score);
    }
  };

  // Handle clicks/taps during gameplay
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;
    
    // Check if clicked on an obstacle in rage mode
    if (isRageMode) {
      const clickX = e.nativeEvent.offsetX;
      const clickY = e.nativeEvent.offsetY;
      
      // Check if click is on any obstacle
      const hitObstacle = obstacles.some(obstacle => {
        const distX = Math.abs(clickX - obstacle.x - 20); // 20 is half the obstacle width
        const distY = Math.abs(clickY - obstacle.y - 20); // 20 is half the obstacle height
        return distX < 20 && distY < 20;
      });
      
      if (hitObstacle) {
        // Deduct points for hitting obstacles
        setScore(prev => Math.max(0, prev - 1));
        return;
      }
    }
    
    // Increment score for valid taps
    setScore(prev => prev + 1);
  };

  // Save score to leaderboard
  const saveScore = async () => {
    if (!playerName.trim()) return;
    
    try {
      await addScore(playerName, score, isRageMode);
      setShowNameInput(false);
      setPlayerName('');
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (obstaclesTimerRef.current) clearInterval(obstaclesTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Game status display */}
      <div className="mb-4 text-center">
        {gameState === 'ready' && countdown > 0 && (
          <div className="text-4xl font-bold">{countdown}</div>
        )}
        {gameState === 'playing' && (
          <div className="text-2xl font-bold text-green-600">Tap Now!</div>
        )}
        {gameState === 'finished' && !showNameInput && (
          <div className="text-2xl font-bold">Game Over!</div>
        )}
      </div>

      {/* Score display */}
      <div className={`mb-6 text-5xl font-bold ${gameState === 'playing' ? 'text-blue-600' : ''}`}>
        {score}
      </div>

      {/* Game area */}
      <div 
        ref={gameAreaRef}
        className={`game-area relative w-full h-64 rounded-lg border-2 flex items-center justify-center cursor-pointer ${
          gameState === 'playing' 
            ? 'bg-green-100 border-green-400' 
            : 'bg-gray-100 border-gray-300'
        }`}
        onClick={handleTap}
      >
        {gameState === 'ready' && countdown === 0 && (
          <div className="text-xl animate-pulse-scale">Get Ready!</div>
        )}
        {gameState === 'ready' && countdown > 0 && (
          <div className="text-4xl font-bold">{countdown}</div>
        )}
        {gameState === 'finished' && !showNameInput && (
          <div className="text-xl">Final Score: {score}</div>
        )}
        
        {/* Render obstacles in rage mode */}
        {isRageMode && gameState === 'playing' && obstacles.map(obstacle => (
          <div 
            key={obstacle.id}
            className="absolute w-10 h-10 bg-red-500 rounded-full opacity-80"
            style={{ left: `${obstacle.x}px`, top: `${obstacle.y}px` }}
          />
        ))}
      </div>

      {/* Name input for leaderboard */}
      {showNameInput && (
        <div className="mt-6 w-full">
          <h3 className="text-xl font-bold mb-2">Save your score: {score}</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={20}
            />
            <button
              onClick={saveScore}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={!playerName.trim()}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Game controls */}
      <div className="mt-6">
        {gameState !== 'playing' && (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-green-500 text-white rounded-full text-lg font-bold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 animate-pulse-scale"
          >
            {gameState === 'finished' ? 'Play Again' : 'Start Game'}
          </button>
        )}
      </div>
    </div>
  );
} 