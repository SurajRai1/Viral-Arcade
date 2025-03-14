'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaFire, FaRedo, FaSkull, FaGamepad, FaShareAlt, FaUserPlus } from 'react-icons/fa';
import Confetti from 'react-confetti';
import Link from 'next/link';

// Sample leaderboard data
const leaderboardData = [
  { name: "ClickMaster", score: 24, country: "🇺🇸" },
  { name: "SpeedDemon", score: 22, country: "🇬🇧" },
  { name: "FingerNinja", score: 21, country: "🇯🇵" },
  { name: "TapKing", score: 19, country: "🇰🇷" },
  { name: "ClickQueen", score: 18, country: "🇨🇦" },
];

interface SpeedClickProps {
  isEmbedded?: boolean;
}

export default function SpeedClick({ isEmbedded = false }: SpeedClickProps) {
  const [gameState, setGameState] = useState<'intro' | 'ready' | 'playing' | 'result'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1000); // 1000ms = 1 second
  const [showConfetti, setShowConfetti] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isRageMode, setIsRageMode] = useState(false);
  const [obstacles, setObstacles] = useState<{id: number, x: number, y: number}[]>([]);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const obstaclesTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickAreaRef = useRef<HTMLDivElement>(null);

  // Start the game with countdown
  const startGame = (rageMode = false) => {
    // If free trial ended and not embedded, show account prompt
    if (freeTrialEnded && !isEmbedded) {
      setShowAccountPrompt(true);
      return;
    }
    
    setIsRageMode(rageMode);
    setGameState('ready');
    setScore(0);
    setCountdown(3);
    setObstacles([]);
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          startPlaying();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start actual gameplay
  const startPlaying = () => {
    setGameState('playing');
    setTimeLeft(1000);
    
    // Start the timer for 1 second
    timerRef.current = setTimeout(() => {
      endGame();
    }, 1000);
    
    // If rage mode, generate obstacles
    if (isRageMode && gameAreaRef.current) {
      generateObstacles();
    }
  };

  // Generate obstacles for rage mode
  const generateObstacles = () => {
    if (!gameAreaRef.current) return;
    
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    
    obstaclesTimerRef.current = setInterval(() => {
      setObstacles(prev => {
        // Add a new obstacle every 100ms
        const newObstacle = {
          id: Date.now(),
          x: Math.random() * (width - 40),
          y: Math.random() * (height - 40)
        };
        return [...prev, newObstacle];
      });
    }, 100);
  };

  // Handle clicks during gameplay
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
        return;
      }
    }
    
    // Increment score for valid clicks
    setScore(prev => prev + 1);
    
    // Visual feedback for click
    if (clickAreaRef.current) {
      const ripple = document.createElement('span');
      ripple.classList.add('click-ripple');
      ripple.style.left = `${e.nativeEvent.offsetX}px`;
      ripple.style.top = `${e.nativeEvent.offsetY}px`;
      clickAreaRef.current.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 500);
    }
  };

  // End the game
  const endGame = () => {
    setGameState('result');
    setShowConfetti(true);
    
    // Clean up timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (obstaclesTimerRef.current) {
      clearInterval(obstaclesTimerRef.current);
    }
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    // Set free trial as ended if this is their first game and not embedded
    if (!hasPlayedFreeGame && !isEmbedded) {
      setHasPlayedFreeGame(true);
      setFreeTrialEnded(true);
      
      // Show account prompt after a short delay
      setTimeout(() => {
        setShowAccountPrompt(true);
      }, 1500);
    }
  };

  // Share score to social media
  const shareScore = () => {
    // In a real app, this would integrate with social media APIs
    alert(`Sharing score of ${score} clicks in 1 second${isRageMode ? ' (Rage Mode)' : ''}!`);
  };

  // Save score to leaderboard
  const saveScore = () => {
    if (!playerName.trim()) {
      alert("Please enter your name to save your score!");
      return;
    }
    
    // In a real app, this would save to a database
    alert(`Score saved! ${playerName}: ${score} clicks in 1 second${isRageMode ? ' (Rage Mode)' : ''}`);
  };

  // Add a function to handle account creation redirect
  const handleCreateAccount = () => {
    // Redirect to the signup page with the game name as a query parameter
    window.location.href = '/signup?from=speed-click';
  };

  // Add a function to continue without account
  const continueWithoutAccount = () => {
    setShowAccountPrompt(false);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (obstaclesTimerRef.current) clearInterval(obstaclesTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 500}
          height={typeof window !== 'undefined' ? window.innerHeight : 500}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Account prompt overlay */}
        {showAccountPrompt && !isEmbedded && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-2">You've Completed Your Free Game!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create an account to play unlimited games and save your scores.
              </p>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleCreateAccount}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center"
                >
                  <FaUserPlus className="mr-2" /> Create Free Account
                </button>
                
                <button
                  onClick={continueWithoutAccount}
                  className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-6">Speed Click Challenge</h1>
            <p className="text-lg mb-8">
              How many times can you click in 1 second? Test your clicking speed and reflexes!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
              <button
                onClick={() => startGame(false)}
                className="py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors"
              >
                <FaGamepad className="inline mr-2" /> Normal Mode
              </button>
              <button
                onClick={() => startGame(true)}
                className="py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg transition-colors"
              >
                <FaSkull className="inline mr-2" /> Rage Mode
              </button>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-w-lg mx-auto">
              <h2 className="font-bold text-lg mb-2">How to Play:</h2>
              <ul className="text-left list-disc pl-5 space-y-1">
                <li>Click as many times as possible within 1 second</li>
                <li>Normal Mode: Just click anywhere in the play area</li>
                <li>Rage Mode: Avoid clicking on the moving obstacles</li>
                <li>Compare your score with players worldwide</li>
              </ul>
            </div>
            
            {freeTrialEnded && !isEmbedded && (
              <div className="mt-6 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg max-w-lg mx-auto">
                <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                  You've played your free game! Create an account to continue playing and save your scores.
                </p>
                <button
                  onClick={handleCreateAccount}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Create Free Account
                </button>
              </div>
            )}
          </motion.div>
        )}
        
        {gameState === 'ready' && (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-4">Get Ready!</h2>
              <div className="w-24 h-24 flex items-center justify-center bg-blue-600 text-white text-4xl font-bold rounded-full mx-auto">
                {countdown}
              </div>
            </motion.div>
          </div>
        )}
        
        {gameState === 'playing' && (
          <div
            ref={gameAreaRef}
            className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden"
          >
            {isRageMode && obstacles.map(obstacle => (
              <motion.div
                key={obstacle.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute w-10 h-10 bg-red-500 rounded-full"
                style={{ left: obstacle.x, top: obstacle.y }}
              />
            ))}
            
            <div
              ref={clickAreaRef}
              onClick={handleClick}
              className="absolute inset-0 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                Score: {score}
              </div>
              
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                Time: {timeLeft}ms
              </div>
              
              {!isRageMode && (
                <div className="text-center text-gray-400 dark:text-gray-300 text-lg">
                  Click anywhere!
                </div>
              )}
            </div>
          </div>
        )}
        
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
            <p className="text-lg mb-6">
              You made <span className="font-bold text-blue-600">{score} clicks</span> in 1 second
              {isRageMode && <span className="text-red-500 font-bold"> (Rage Mode)</span>}
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => startGame(isRageMode)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FaRedo className="inline mr-1" /> Play Again
              </button>
              <button
                onClick={() => startGame(!isRageMode)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {isRageMode ? 'Try Normal Mode' : 'Try Rage Mode'}
              </button>
              <button
                onClick={shareScore}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FaShareAlt className="inline mr-1" /> Share Score
              </button>
            </div>
            
            {freeTrialEnded && !isEmbedded && (
              <div className="mb-8 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg max-w-lg mx-auto">
                <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                  You've played your free game! Create an account to continue playing and save your scores.
                </p>
                <button
                  onClick={handleCreateAccount}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Create Free Account
                </button>
              </div>
            )}
            
            <div className="max-w-md mx-auto">
              <h3 className="font-bold text-xl mb-4 flex items-center justify-center">
                <FaTrophy className="text-yellow-500 mr-2" /> Leaderboard
              </h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="py-2 px-4 text-left">Rank</th>
                      <th className="py-2 px-4 text-left">Player</th>
                      <th className="py-2 px-4 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry, index) => (
                      <tr 
                        key={index}
                        className={`border-t border-gray-200 dark:border-gray-700 ${
                          index < 3 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                        }`}
                      >
                        <td className="py-3 px-4">
                          {index === 0 && <span className="text-yellow-500">🥇</span>}
                          {index === 1 && <span className="text-gray-400">🥈</span>}
                          {index === 2 && <span className="text-amber-600">🥉</span>}
                          {index > 2 && `#${index + 1}`}
                        </td>
                        <td className="py-3 px-4">
                          {entry.name} {entry.country}
                        </td>
                        <td className="py-3 px-4 text-right font-bold">
                          {entry.score}
                        </td>
                      </tr>
                    ))}
                    
                    {/* Your score */}
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                      <td className="py-3 px-4">You</td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          placeholder="Enter your name"
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded w-full max-w-[150px] dark:bg-gray-700"
                        />
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        {score}
                        <button
                          onClick={saveScore}
                          className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      <style jsx>{`
        .click-ripple {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 0.5s linear;
          pointer-events: none;
        }
        
        @keyframes ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          100% {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 