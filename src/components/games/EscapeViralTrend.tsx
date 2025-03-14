'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaRedo, FaShareAlt, FaTrophy, FaUserPlus } from 'react-icons/fa';
import Confetti from 'react-confetti';

// Sample viral trends for the game
const viralTrends = [
  { name: "Dance Challenge", emoji: "💃", speed: 1 },
  { name: "Food Challenge", emoji: "🍔", speed: 1.2 },
  { name: "Prank Video", emoji: "😜", speed: 1.5 },
  { name: "Life Hack", emoji: "💡", speed: 0.8 },
  { name: "Pet Trick", emoji: "🐶", speed: 1.3 },
  { name: "Makeup Tutorial", emoji: "💄", speed: 0.9 },
  { name: "Reaction Video", emoji: "😲", speed: 1.1 },
  { name: "Unboxing", emoji: "📦", speed: 0.7 },
  { name: "Outfit of the Day", emoji: "👕", speed: 1 },
  { name: "Room Tour", emoji: "🏠", speed: 0.8 }
];

interface EscapeViralTrendProps {
  isEmbedded?: boolean;
}

export default function EscapeViralTrend({ isEmbedded = false }: EscapeViralTrendProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentTrend, setCurrentTrend] = useState<{name: string, emoji: string, speed: number} | null>(null);
  const [trendPosition, setTrendPosition] = useState({ x: 50, y: 50 });
  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 80 });
  const [gameAreaSize, setGameAreaSize] = useState({ width: 300, height: 300 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const trendTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  
  // Start the game
  const startGame = () => {
    // If free trial ended and not embedded, show account prompt
    if (freeTrialEnded && !isEmbedded) {
      setShowAccountPrompt(true);
      return;
    }
    
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    
    // Set initial positions
    setPlayerPosition({ x: 50, y: 80 });
    spawnNewTrend();
    
    // Start the game timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Update game area size
    if (gameAreaRef.current) {
      const { width, height } = gameAreaRef.current.getBoundingClientRect();
      setGameAreaSize({ width, height });
    }
  };
  
  // Spawn a new viral trend
  const spawnNewTrend = () => {
    // Get a random trend
    const randomTrend = viralTrends[Math.floor(Math.random() * viralTrends.length)];
    setCurrentTrend(randomTrend);
    
    // Set random position (away from player)
    let x, y;
    do {
      x = Math.random() * 80 + 10; // 10-90%
      y = Math.random() * 80 + 10; // 10-90%
    } while (
      Math.abs(x - playerPosition.x) < 30 &&
      Math.abs(y - playerPosition.y) < 30
    );
    
    setTrendPosition({ x, y });
    
    // Start moving the trend towards the player
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
    }
    
    moveTimerRef.current = setInterval(() => {
      moveTrendTowardsPlayer();
    }, 50);
  };
  
  // Move trend towards player
  const moveTrendTowardsPlayer = () => {
    if (!currentTrend) return;
    
    setTrendPosition((prev) => {
      // Calculate direction to player
      const dx = playerPosition.x - prev.x;
      const dy = playerPosition.y - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Normalize and apply speed
      let speedMultiplier = currentTrend.speed;
      
      // Apply difficulty modifier
      if (difficulty === 'easy') speedMultiplier *= 0.7;
      if (difficulty === 'hard') speedMultiplier *= 1.3;
      
      const moveX = (dx / distance) * 0.5 * speedMultiplier;
      const moveY = (dy / distance) * 0.5 * speedMultiplier;
      
      return {
        x: prev.x + moveX,
        y: prev.y + moveY
      };
    });
    
    // Check for collision
    checkCollision();
  };
  
  // Check if trend collided with player
  const checkCollision = () => {
    const playerSize = 40; // player diameter in pixels
    const trendSize = 50; // trend diameter in pixels
    
    // Convert percentage positions to pixels
    const playerPxX = (playerPosition.x / 100) * gameAreaSize.width;
    const playerPxY = (playerPosition.y / 100) * gameAreaSize.height;
    const trendPxX = (trendPosition.x / 100) * gameAreaSize.width;
    const trendPxY = (trendPosition.y / 100) * gameAreaSize.height;
    
    // Calculate distance between centers
    const dx = playerPxX - trendPxX;
    const dy = playerPxY - trendPxY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If distance is less than sum of radii, collision occurred
    if (distance < (playerSize / 2) + (trendSize / 2)) {
      handleCollision();
    }
  };
  
  // Handle collision with trend
  const handleCollision = () => {
    // Player got caught by the trend
    endGame();
  };
  
  // Handle player movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;
    
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate percentage position within game area
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Clamp values to stay within bounds
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    
    setPlayerPosition({ x: clampedX, y: clampedY });
  };
  
  // Handle touch movement for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (gameState !== 'playing') return;
    
    const touch = e.touches[0];
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect || !touch) return;
    
    // Calculate percentage position within game area
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    // Clamp values to stay within bounds
    const clampedX = Math.max(5, Math.min(95, x));
    const clampedY = Math.max(5, Math.min(95, y));
    
    setPlayerPosition({ x: clampedX, y: clampedY });
    
    // Prevent scrolling while playing
    e.preventDefault();
  };
  
  // End the game
  const endGame = () => {
    setGameState('result');
    
    // Calculate final score based on time survived
    const finalScore = score + timeLeft;
    setScore(finalScore);
    
    // Show confetti for good scores (survived more than 20 seconds)
    if (timeLeft > 20) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    
    // Clean up timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
    }
    
    if (trendTimerRef.current) {
      clearInterval(trendTimerRef.current);
    }
    
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
    alert(`Sharing score: You survived ${timeLeft} seconds and scored ${score} points!`);
  };

  // Add a function to handle account creation redirect
  const handleCreateAccount = () => {
    // Redirect to the signup page with the game name as a query parameter
    window.location.href = '/signup?from=escape-viral-trend';
  };

  // Add a function to continue without account
  const continueWithoutAccount = () => {
    setShowAccountPrompt(false);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (moveTimerRef.current) clearInterval(moveTimerRef.current);
      if (trendTimerRef.current) clearInterval(trendTimerRef.current);
    };
  }, []);
  
  // Update score every second while playing
  useEffect(() => {
    if (gameState === 'playing') {
      const scoreInterval = setInterval(() => {
        setScore(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(scoreInterval);
    }
  }, [gameState]);
  
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
            <h1 className="text-3xl font-bold mb-6">Escape the Viral Trend</h1>
            <p className="text-lg mb-8">
              Move your character to avoid getting caught by viral internet trends!
            </p>
            
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-4">Select Difficulty:</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setDifficulty('easy')}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                    difficulty === 'easy' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setDifficulty('medium')}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                    difficulty === 'medium' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setDifficulty('hard')}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                    difficulty === 'hard' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Hard
                </button>
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors mx-auto mb-8 flex items-center"
            >
              <FaPlay className="mr-2" /> Start Game
            </button>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-w-lg mx-auto">
              <h2 className="font-bold text-lg mb-2">How to Play:</h2>
              <ul className="text-left list-disc pl-5 space-y-1">
                <li>Move your character with your mouse or finger</li>
                <li>Avoid the viral trends chasing you</li>
                <li>Survive as long as possible</li>
                <li>The longer you survive, the higher your score</li>
                <li>You have 30 seconds to escape</li>
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
        
        {gameState === 'playing' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between mb-4">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
                <span className="font-bold">Score: {score}</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md">
                <span className="font-bold">Time: {timeLeft}s</span>
              </div>
            </div>
            
            <div 
              ref={gameAreaRef}
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl relative overflow-hidden"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            >
              {/* Player character */}
              <motion.div
                ref={playerRef}
                className="absolute w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  left: `calc(${playerPosition.x}% - 20px)`,
                  top: `calc(${playerPosition.y}% - 20px)`,
                }}
                animate={{
                  x: 0,
                  y: 0,
                }}
                transition={{ type: "spring", damping: 10 }}
              >
                😎
              </motion.div>
              
              {/* Viral trend */}
              {currentTrend && (
                <motion.div
                  className="absolute w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    left: `calc(${trendPosition.x}% - 24px)`,
                    top: `calc(${trendPosition.y}% - 24px)`,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                  }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  {currentTrend.emoji}
                </motion.div>
              )}
              
              {/* Instructions overlay */}
              <div className="absolute top-4 left-0 right-0 text-center text-gray-500 dark:text-gray-400 pointer-events-none">
                Move your mouse or finger to avoid the trend!
              </div>
            </div>
          </div>
        )}
        
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-2">
              {timeLeft > 0 ? "You Survived!" : "Caught by the Trend!"}
            </h2>
            <p className="text-lg mb-6">
              {timeLeft > 0 
                ? `Impressive! You survived the full 30 seconds!`
                : `You got caught by the viral trend after ${score} seconds.`
              }
            </p>
            <p className="text-xl font-bold mb-8">
              Final Score: {score + timeLeft}
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={startGame}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FaRedo className="inline mr-1" /> Play Again
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
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                      <td className="py-3 px-4">
                        <span className="text-yellow-500">🥇</span>
                      </td>
                      <td className="py-3 px-4">TrendDodger 🇺🇸</td>
                      <td className="py-3 px-4 text-right font-bold">60</td>
                    </tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                      <td className="py-3 px-4">
                        <span className="text-gray-400">🥈</span>
                      </td>
                      <td className="py-3 px-4">ViralEscaper 🇬🇧</td>
                      <td className="py-3 px-4 text-right font-bold">58</td>
                    </tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                      <td className="py-3 px-4">
                        <span className="text-amber-600">🥉</span>
                      </td>
                      <td className="py-3 px-4">TikTokAvoider 🇯🇵</td>
                      <td className="py-3 px-4 text-right font-bold">55</td>
                    </tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">#4</td>
                      <td className="py-3 px-4">MemeRunner 🇨🇦</td>
                      <td className="py-3 px-4 text-right font-bold">52</td>
                    </tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">#5</td>
                      <td className="py-3 px-4">TrendSurfer 🇦🇺</td>
                      <td className="py-3 px-4 text-right font-bold">48</td>
                    </tr>
                    
                    {/* Your score */}
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                      <td className="py-3 px-4">You</td>
                      <td className="py-3 px-4">You</td>
                      <td className="py-3 px-4 text-right font-bold">{score + timeLeft}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 