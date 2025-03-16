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
  const [timeLeft, setTimeLeft] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isRageMode, setIsRageMode] = useState(false);
  const [obstacles, setObstacles] = useState<{id: number, x: number, y: number, size: number, dx: number, dy: number}[]>([]);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const clickAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const gameStartTimeRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const isGameActiveRef = useRef<boolean>(false);
  const obstaclesTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add audio refs
  const clickSoundRef = useRef<{ play: () => void } | null>(null);
  const countdownSoundRef = useRef<{ play: () => void } | null>(null);
  const gameOverSoundRef = useRef<{ play: () => void } | null>(null);
  const successSoundRef = useRef<{ play: () => void } | null>(null);

  // Add audio state
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Initialize audio on mount
  useEffect(() => {
    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create simple beep function
    const beep = (frequency: number, duration: number, volume: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = volume;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
      }, duration);
    };
    
    // Create sound functions
    const playClickSound = () => beep(1000, 10, 0.1);
    const playCountdownSound = () => beep(440, 100, 0.2);
    const playGameOverSound = () => {
      beep(400, 100, 0.3);
      setTimeout(() => beep(300, 200, 0.3), 100);
    };
    const playSuccessSound = () => {
      beep(440, 100, 0.2);
      setTimeout(() => beep(660, 100, 0.2), 100);
      setTimeout(() => beep(880, 200, 0.2), 200);
    };

    // Store sound functions
    clickSoundRef.current = { play: playClickSound };
    countdownSoundRef.current = { play: playCountdownSound };
    gameOverSoundRef.current = { play: playGameOverSound };
    successSoundRef.current = { play: playSuccessSound };

    return () => {
      audioContext.close();
      clickSoundRef.current = null;
      countdownSoundRef.current = null;
      gameOverSoundRef.current = null;
      successSoundRef.current = null;
    };
  }, []);

  // Play sound utility function
  const playSound = (soundRef: React.RefObject<{ play: () => void } | null>) => {
    if (!isSoundEnabled || !soundRef.current) return;
    try {
      soundRef.current.play();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Toggle sound
  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  // Start the game with countdown
  const startGame = (rageMode = false) => {
    if (freeTrialEnded && !isEmbedded) {
      return;
    }
    
    // Reset all game state
    setIsRageMode(rageMode);
    setGameState('ready');
    setScore(0);
    scoreRef.current = 0;
    setCountdown(3);
    setObstacles([]);
    isGameActiveRef.current = false;
    
    // Clear any existing timers
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (obstaclesTimerRef.current) clearInterval(obstaclesTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    
    // Start countdown with sound
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 0) {
          playSound(countdownSoundRef);
        }
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current!);
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
    setTimeLeft(1);
    gameStartTimeRef.current = performance.now();
    isGameActiveRef.current = true;
    
    // Start the game timer using performance.now() for better precision
    const updateTimer = () => {
      if (!isGameActiveRef.current) return;
      
      const elapsed = (performance.now() - gameStartTimeRef.current) / 1000;
      if (elapsed >= 1) {
        endGame();
      } else {
        setTimeLeft(1 - elapsed);
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      }
    };
    animationFrameRef.current = requestAnimationFrame(updateTimer);
    
    // If rage mode, generate obstacles
    if (isRageMode) {
      generateObstacles();
    }
  };

  // Generate obstacles for rage mode
  const generateObstacles = () => {
    if (!gameAreaRef.current) return;
    
    const { width, height } = gameAreaRef.current.getBoundingClientRect();
    const padding = 60; // Padding from edges
    
    // Initial obstacles with velocity
    const initialObstacles = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * (width - padding * 2) + padding,
      y: Math.random() * (height - padding * 2) + padding,
      size: Math.random() * 20 + 40, // Random size between 40-60px
      dx: (Math.random() - 0.5) * 4, // Random velocity X
      dy: (Math.random() - 0.5) * 4  // Random velocity Y
    }));
    setObstacles(initialObstacles);
    
    // Update obstacle positions with boundary checking
    obstaclesTimerRef.current = setInterval(() => {
      setObstacles(prev => prev.map(obstacle => {
        let newX = obstacle.x + obstacle.dx;
        let newY = obstacle.y + obstacle.dy;
        let newDx = obstacle.dx;
        let newDy = obstacle.dy;
        
        // Bounce off walls
        if (newX <= padding || newX >= width - padding) {
          newDx = -newDx;
          newX = newX <= padding ? padding : width - padding;
        }
        if (newY <= padding || newY >= height - padding) {
          newDy = -newDy;
          newY = newY <= padding ? padding : height - padding;
        }
        
        return {
          ...obstacle,
          x: newX,
          y: newY,
          dx: newDx,
          dy: newDy
        };
      }));
    }, 16); // Update at ~60fps
  };

  // Handle clicks during gameplay
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !isGameActiveRef.current) return;
    
    const clickX = e.nativeEvent.offsetX;
    const clickY = e.nativeEvent.offsetY;
    
    // Check if clicked on an obstacle in rage mode
    if (isRageMode) {
      const hitObstacle = obstacles.some(obstacle => {
        const distX = clickX - obstacle.x;
        const distY = clickY - obstacle.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < obstacle.size / 2;
      });
      
      if (hitObstacle) {
        playSound(gameOverSoundRef);
        endGame();
        return;
      }
    }
    
    // Only count clicks if within the 1-second window
    const elapsed = (performance.now() - gameStartTimeRef.current) / 1000;
    if (elapsed <= 1) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      playSound(clickSoundRef);
      
      // Visual feedback for click
      if (clickAreaRef.current) {
        const ripple = document.createElement('span');
        ripple.classList.add('click-ripple');
        ripple.style.left = `${clickX}px`;
        ripple.style.top = `${clickY}px`;
        clickAreaRef.current.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 500);
      }
    }
  };

  // End the game
  const endGame = () => {
    isGameActiveRef.current = false;
    setGameState('result');
    setShowConfetti(true);
    
    // Play appropriate sound
    if (isRageMode && scoreRef.current === 0) {
      playSound(gameOverSoundRef);
    } else {
      playSound(successSoundRef);
    }
    
    // Clean up timers
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (obstaclesTimerRef.current) {
      clearInterval(obstaclesTimerRef.current);
      obstaclesTimerRef.current = null;
    }
    
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
    
    // Handle free trial logic
    if (!hasPlayedFreeGame && !isEmbedded) {
      setHasPlayedFreeGame(true);
      setFreeTrialEnded(true);
    }
  };

  // Share score
  const shareScore = async () => {
    try {
      await navigator.share({
        title: 'Speed Click Challenge',
        text: `I made ${scoreRef.current} clicks in 1 second${isRageMode ? ' in Rage Mode' : ''}! Can you beat my score?`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Save score to leaderboard
  const saveScore = () => {
    if (!playerName.trim()) {
      alert("Please enter your name to save your score!");
      return;
    }
    
    // In a real app, this would save to a database
    alert(`Score saved! ${playerName}: ${scoreRef.current} clicks in 1 second${isRageMode ? ' (Rage Mode)' : ''}`);
  };

  // Add a function to handle account creation redirect
  const handleCreateAccount = () => {
    // Redirect to the signup page with the game name as a query parameter
    window.location.href = '/signup?from=speed-click';
  };

  // Add a function to continue without account
  const continueWithoutAccount = () => {
    setShowConfetti(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (obstaclesTimerRef.current) clearInterval(obstaclesTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {showConfetti && <Confetti />}
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden min-h-[400px]">
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8"
          >
            <h1 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Speed Click Challenge
            </h1>
            <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
              How many times can you click in exactly 1 second? Test your speed!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
              <button
                onClick={() => startGame(false)}
                className="py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg transition-all hover:scale-105"
              >
                <FaGamepad className="inline mr-2" /> Normal Mode
              </button>
              <button
                onClick={() => startGame(true)}
                className="py-4 px-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-lg transition-all hover:scale-105"
              >
                <FaSkull className="inline mr-2" /> Rage Mode
              </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl max-w-lg mx-auto">
              <h2 className="font-bold text-lg mb-4">How to Play:</h2>
              <ul className="text-left space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Click as many times as possible in exactly 1 second
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Normal Mode: Just click anywhere in the play area
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Rage Mode: Avoid the moving red obstacles while clicking
                </li>
              </ul>
            </div>
          </motion.div>
        )}
        
        {gameState === 'ready' && (
          <div className="flex items-center justify-center h-full">
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-center"
            >
              <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-6xl font-bold rounded-full">
                {countdown}
              </div>
            </motion.div>
          </div>
        )}
        
        {gameState === 'playing' && (
          <div
            ref={gameAreaRef}
            className="relative w-full h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700"
          >
            {isRageMode && obstacles.map(obstacle => (
              <motion.div
                key={obstacle.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bg-red-500 rounded-full flex items-center justify-center"
                style={{
                  left: obstacle.x,
                  top: obstacle.y,
                  width: obstacle.size,
                  height: obstacle.size,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <FaSkull className="text-white" style={{ fontSize: obstacle.size * 0.4 }} />
              </motion.div>
            ))}
            
            <div
              ref={clickAreaRef}
              onClick={handleClick}
              className="absolute inset-0 cursor-pointer"
            >
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-6 py-2 rounded-full shadow-lg flex items-center space-x-6">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Time</div>
                  <div className="font-bold">{timeLeft.toFixed(3)}s</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Score</div>
                  <div className="font-bold">{score}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8"
          >
            <h2 className="text-3xl font-bold mb-4">
              {isRageMode && scoreRef.current === 0 ? 'Game Over!' : 'Time\'s Up!'}
            </h2>
            
            <div className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              {scoreRef.current}
              <span className="text-2xl ml-2">clicks</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={() => startGame(isRageMode)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold transition-all hover:scale-105"
              >
                <FaRedo className="inline mr-2" /> Try Again
              </button>
              <button
                onClick={() => startGame(!isRageMode)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold transition-all hover:scale-105"
              >
                {isRageMode ? 'Try Normal Mode' : 'Try Rage Mode'}
              </button>
              <button
                onClick={shareScore}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-bold transition-all hover:scale-105"
              >
                <FaShareAlt className="inline mr-2" /> Share Score
              </button>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Add sound toggle button */}
      <button
        onClick={toggleSound}
        className="fixed bottom-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform"
        aria-label={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
      >
        {isSoundEnabled ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75l-2.25-2.25H6a1.5 1.5 0 01-1.5-1.5v-6A1.5 1.5 0 016 7.5h3.75L12 5.25v13.5z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
      </button>
      
      <style jsx>{`
        .click-ripple {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 0.5s ease-out;
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