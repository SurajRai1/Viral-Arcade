'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShareAlt, FaTrophy, FaFire, FaRedo, FaSkull, FaGamepad } from 'react-icons/fa';
import Link from 'next/link';
import Confetti from 'react-confetti';

// Sample leaderboard data
const leaderboardData = [
  { name: "ClickMaster", score: 24, country: "🇺🇸" },
  { name: "SpeedDemon", score: 22, country: "🇬🇧" },
  { name: "FingerNinja", score: 21, country: "🇯🇵" },
  { name: "TapKing", score: 19, country: "🇰🇷" },
  { name: "ClickQueen", score: 18, country: "🇨🇦" },
];

export default function SpeedClickPage() {
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
    
    // Set free trial as ended if this is their first game
    if (!hasPlayedFreeGame) {
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
    <MainLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="container mx-auto px-4 py-12">
        {/* Game header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/games"
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Games
          </Link>
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
            Who Can Click the Fastest?
          </h1>
          
          <Link
            href="/leaderboards"
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <FaTrophy className="mr-2" /> Leaderboard
          </Link>
        </div>
        
        {/* Game content */}
        <div className="max-w-3xl mx-auto">
          {/* Intro screen */}
          {gameState === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">The Ultimate Speed Test!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You have exactly ONE SECOND to click as many times as possible. 
                    How fast are your fingers? Challenge your friends and set a new record!
                  </p>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-2">How to Play:</h3>
                    <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                      <li>• When the countdown ends, click as fast as you can</li>
                      <li>• You have exactly 1 second to get as many clicks as possible</li>
                      <li>• Compare your score with players worldwide</li>
                      <li>• Try "Rage Mode" for an extra challenge with obstacles</li>
                      <li>• Share your results and challenge your friends</li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => startGame(false)}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                    >
                      Start Normal Mode
                    </button>
                    
                    <button
                      onClick={() => startGame(true)}
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                      <FaSkull className="mr-2" /> Rage Mode
                    </button>
                  </div>
                  
                  {hasPlayedFreeGame && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-700 dark:text-yellow-400 font-medium">
                        You've played your free game! Create an account to continue playing and save your scores.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* World Records */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <FaTrophy className="text-yellow-500 mr-2" /> World Records
                  </h3>
                  
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rank</th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Player</th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Country</th>
                          <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {leaderboardData.map((entry, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                            <td className="py-2 px-4 whitespace-nowrap">
                              {index === 0 ? (
                                <span className="text-yellow-500 font-bold">🥇 1st</span>
                              ) : index === 1 ? (
                                <span className="text-gray-400 font-bold">🥈 2nd</span>
                              ) : index === 2 ? (
                                <span className="text-amber-700 font-bold">🥉 3rd</span>
                              ) : (
                                <span className="text-gray-500">{index + 1}th</span>
                              )}
                            </td>
                            <td className="py-2 px-4 whitespace-nowrap font-medium">{entry.name}</td>
                            <td className="py-2 px-4 whitespace-nowrap">{entry.country}</td>
                            <td className="py-2 px-4 whitespace-nowrap font-bold text-green-600 dark:text-green-400">{entry.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Ready screen (countdown) */}
          {gameState === 'ready' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8">
                <h2 className="text-2xl font-bold mb-4">Get Ready!</h2>
                
                <div className="my-12">
                  <div className={`text-8xl font-bold ${
                    isRageMode ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {countdown}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400">
                  {isRageMode 
                    ? "RAGE MODE: Avoid the obstacles while clicking!" 
                    : "Click as fast as you can when the countdown ends!"}
                </p>
              </div>
            </motion.div>
          )}
          
          {/* Playing screen */}
          {gameState === 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              <div 
                ref={gameAreaRef}
                className={`relative w-full h-96 rounded-xl shadow-lg overflow-hidden cursor-pointer ${
                  isRageMode 
                    ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500' 
                    : 'bg-gradient-to-br from-green-500/20 to-blue-500/20 border-2 border-green-500'
                }`}
                onClick={handleClick}
              >
                {/* Click area with ripple effect */}
                <div 
                  ref={clickAreaRef}
                  className="absolute inset-0 overflow-hidden"
                >
                  {/* Click counter */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className={`text-8xl font-bold ${
                      isRageMode ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {score}
                    </div>
                  </div>
                  
                  {/* Obstacles for rage mode */}
                  {isRageMode && obstacles.map(obstacle => (
                    <motion.div 
                      key={obstacle.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute w-10 h-10 bg-red-500 rounded-full"
                      style={{ left: `${obstacle.x}px`, top: `${obstacle.y}px` }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-gray-600 dark:text-gray-400">
                Click anywhere in the box above!
              </div>
            </motion.div>
          )}
          
          {/* Result screen */}
          {gameState === 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {isRageMode ? "Rage Mode Complete!" : "Time's Up!"}
                </h2>
                
                <div className="mb-8 text-center">
                  <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isRageMode 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}>
                    <div className="text-5xl text-white">
                      {score}
                    </div>
                  </div>
                  
                  <p className="text-xl font-bold mb-1">
                    {score} clicks in 1 second!
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {score < 10 
                      ? "Keep practicing! You can do better!" 
                      : score < 15 
                      ? "Not bad! You've got some speed!" 
                      : score < 20 
                      ? "Impressive clicking skills!" 
                      : "WOW! You're a clicking master!"}
                  </p>
                  
                  {score > 15 && (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 mb-4">
                      <p className="text-yellow-800 dark:text-yellow-300 flex items-center">
                        <FaFire className="mr-2" /> You're in the top 10% of players worldwide!
                      </p>
                    </div>
                  )}
                  
                  {/* Save score form - only show if user has an account */}
                  {!freeTrialEnded && (
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                      <h3 className="font-bold mb-2">Save Your Score:</h3>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          placeholder="Enter your name"
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          onClick={saveScore}
                          disabled={!playerName.trim()}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {freeTrialEnded && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">
                        You've played your free game!
                      </p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-500">
                        Create an account to continue playing and save your scores on the leaderboard.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {freeTrialEnded ? (
                    <>
                      <button
                        onClick={handleCreateAccount}
                        className="px-6 py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        Create Free Account
                      </button>
                      
                      <button
                        onClick={() => setShowAccountPrompt(true)}
                        className="px-6 py-3 bg-gray-500 text-white font-medium rounded-full hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        Learn More
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={shareScore}
                        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                      >
                        <FaShareAlt className="mr-2" /> Share Score
                      </button>
                      
                      <button
                        onClick={() => startGame(isRageMode)}
                        className={`px-6 py-3 text-white font-medium rounded-full flex items-center justify-center ${
                          isRageMode 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        <FaRedo className="mr-2" /> Try Again
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* CSS for click ripple effect */}
      <style jsx global>{`
        .click-ripple {
          position: absolute;
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 0.5s linear;
          pointer-events: none;
        }
        
        @keyframes ripple {
          0% {
            width: 0px;
            height: 0px;
            opacity: 0.5;
          }
          100% {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
      `}</style>
      
      {/* Account prompt overlay */}
      {showAccountPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGamepad className="text-green-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You've Completed Your Free Game!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create an account to unlock unlimited games, save your scores, and compete on leaderboards.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Account Benefits:</h3>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Unlimited access to all games
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Save your scores on global leaderboards
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Track your progress and improvement
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Challenge friends and share results
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreateAccount}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                Create Free Account
              </button>
              
              <button
                onClick={continueWithoutAccount}
                className="w-full py-3 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Continue Without Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
} 