'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaPlay, FaRedo, FaTrophy, FaShareAlt, FaInfoCircle, FaVolumeUp, FaVolumeMute, FaSkull } from 'react-icons/fa';

interface SpeedClickProps {
  isEmbedded?: boolean;
}

export default function SpeedClick({ isEmbedded = false }: SpeedClickProps) {
  // Game states
  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'playing' | 'finished'>('idle');
  const [gameMode, setGameMode] = useState<'normal' | 'rage'>('normal');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(1); // 1 second game time
  const [clicks, setClicks] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [rageHighScore, setRageHighScore] = useState(0);
  const [cps, setCps] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [clickPositions, setClickPositions] = useState<{x: number, y: number, id: number}[]>([]);
  const [obstacles, setObstacles] = useState<{x: number, y: number, size: number, id: number}[]>([]);
  const [gameOver, setGameOver] = useState(false);
  
  // Refs
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const countdownSoundRef = useRef<HTMLAudioElement | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const failSoundRef = useRef<HTMLAudioElement | null>(null);
  const nextClickId = useRef(0);
  const obstacleId = useRef(0);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        clickSoundRef.current = new Audio('/sounds/click.mp3');
        countdownSoundRef.current = new Audio('/sounds/countdown.mp3');
        successSoundRef.current = new Audio('/sounds/success.mp3');
        failSoundRef.current = new Audio('/sounds/fail.mp3');
      } catch (e) {
        console.error("Failed to load audio files:", e);
        // Set to null to prevent errors when trying to play
        clickSoundRef.current = null;
        countdownSoundRef.current = null;
        successSoundRef.current = null;
        failSoundRef.current = null;
      }
    }
    
    // Load high scores from localStorage
    const savedHighScore = localStorage.getItem('speedclick_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    
    const savedRageHighScore = localStorage.getItem('speedclick_rage_highscore');
    if (savedRageHighScore) {
      setRageHighScore(parseInt(savedRageHighScore));
    }
    
    return () => {
      // Cleanup audio
      clickSoundRef.current = null;
      countdownSoundRef.current = null;
      successSoundRef.current = null;
      failSoundRef.current = null;
    };
  }, []);
  
  // Countdown timer
  useEffect(() => {
    if (gameState !== 'countdown') return;
    
    if (countdown > 0) {
      // Play countdown sound
      if (!isMuted && countdownSoundRef.current) {
        try {
          countdownSoundRef.current.currentTime = 0;
          countdownSoundRef.current.play().catch(e => console.error("Audio play failed:", e));
        } catch (e) {
          console.error("Failed to play countdown sound:", e);
        }
      }
      
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Start the game
      setGameState('playing');
      setTimeLeft(1); // 1 second game time
      setClicks(0);
      setClickPositions([]);
      setObstacles([]);
      setGameOver(false);
      
      // Generate obstacles for rage mode
      if (gameMode === 'rage') {
        generateObstacles();
      }
    }
  }, [countdown, gameState, isMuted, gameMode]);
  
  // Generate obstacles for rage mode
  const generateObstacles = () => {
    const newObstacles = [];
    const obstacleCount = Math.floor(Math.random() * 3) + 3; // 3-5 obstacles
    
    for (let i = 0; i < obstacleCount; i++) {
      newObstacles.push({
        x: Math.random() * 80 + 10, // 10-90% of width
        y: Math.random() * 80 + 10, // 10-90% of height
        size: Math.random() * 10 + 10, // 10-20% of container
        id: obstacleId.current++
      });
    }
    
    setObstacles(newObstacles);
  };
  
  // Finish the game - defined with useCallback to avoid dependency issues
  const finishGame = useCallback(() => {
    setGameState('finished');
    
    // Calculate clicks per second
    const finalCps = clicks;
    setCps(finalCps);
    
    // Check if it's a new high score
    if (gameMode === 'normal' && finalCps > highScore && !gameOver) {
      setHighScore(finalCps);
      setIsNewHighScore(true);
      localStorage.setItem('speedclick_highscore', finalCps.toString());
      
      // Play success sound and trigger confetti
      if (!isMuted && successSoundRef.current) {
        try {
          successSoundRef.current.play().catch(e => console.error("Audio play failed:", e));
        } catch (e) {
          console.error("Failed to play success sound:", e);
        }
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else if (gameMode === 'rage' && finalCps > rageHighScore && !gameOver) {
      setRageHighScore(finalCps);
      setIsNewHighScore(true);
      localStorage.setItem('speedclick_rage_highscore', finalCps.toString());
      
      // Play success sound and trigger confetti
      if (!isMuted && successSoundRef.current) {
        try {
          successSoundRef.current.play().catch(e => console.error("Audio play failed:", e));
        } catch (e) {
          console.error("Failed to play success sound:", e);
        }
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      setIsNewHighScore(false);
    }
    
    // Show results after a short delay
    setTimeout(() => {
      setShowResults(true);
    }, 500);
  }, [clicks, gameMode, highScore, rageHighScore, gameOver, isMuted]);
  
  // Game timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 0.1);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Game finished
      finishGame();
    }
  }, [timeLeft, gameState, finishGame]);
  
  // Start the game
  const startGame = (mode: 'normal' | 'rage' = 'normal') => {
    setGameMode(mode);
    setGameState('countdown');
    setCountdown(3);
    setShowResults(false);
  };
  
  // Handle click during gameplay
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || gameOver) return;
    
    // Get click position relative to game area
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Check if clicked on obstacle (rage mode)
      if (gameMode === 'rage') {
        for (const obstacle of obstacles) {
          const dx = x - obstacle.x;
          const dy = y - obstacle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < obstacle.size / 2) {
            // Hit obstacle - game over
            if (!isMuted && failSoundRef.current) {
              try {
                failSoundRef.current.play().catch(e => console.error("Audio play failed:", e));
              } catch (e) {
                console.error("Failed to play fail sound:", e);
              }
            }
            
            setGameOver(true);
            setTimeout(() => finishGame(), 500);
            return;
          }
        }
      }
      
      // Play click sound
      if (!isMuted && clickSoundRef.current) {
        try {
          clickSoundRef.current.currentTime = 0;
          clickSoundRef.current.play().catch(e => console.error("Audio play failed:", e));
        } catch (e) {
          console.error("Failed to play click sound:", e);
        }
      }
      
      // Add click position with unique ID
      const newClickPosition = { x, y, id: nextClickId.current++ };
      setClickPositions(prev => [...prev, newClickPosition]);
      
      // Remove click position after animation
      setTimeout(() => {
        setClickPositions(prev => prev.filter(pos => pos.id !== newClickPosition.id));
      }, 1000);
      
      setClicks(prev => prev + 1);
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState('idle');
    setClicks(0);
    setTimeLeft(1);
    setShowResults(false);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Toggle tutorial
  const toggleTutorial = () => {
    setShowTutorial(!showTutorial);
  };
  
  // Get progress bar color based on time left
  const getProgressColor = () => {
    if (timeLeft > 0.7) return 'bg-green-500';
    if (timeLeft > 0.3) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="w-full max-w-lg mx-auto p-2">
      {/* Game header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Speed Click
        </h1>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={toggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </motion.button>
          
          <motion.button
            onClick={toggleTutorial}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 text-gray-600 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400"
            aria-label="How to play"
          >
            <FaInfoCircle />
          </motion.button>
        </div>
      </div>
      
      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-2">How to Play</h2>
              <div className="mb-4">
                <h3 className="font-bold text-blue-500">Normal Mode</h3>
                <p className="text-sm mb-2">Click as many times as possible in 1 second!</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-red-500">Rage Mode</h3>
                <p className="text-sm mb-2">Click as many times as possible in 1 second, but avoid the red obstacles!</p>
              </div>
              
              <div className="flex justify-center">
                <motion.button
                  onClick={() => setShowTutorial(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full"
                >
                  Got it!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game area */}
      <motion.div
        ref={gameAreaRef}
        className={`
          relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg mb-4
          ${gameState === 'idle' ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20' : ''}
          ${gameState === 'countdown' ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : ''}
          ${gameState === 'playing' && !gameOver ? 'bg-gradient-to-br from-green-500/20 to-teal-500/20 cursor-pointer' : ''}
          ${(gameState === 'finished' || gameOver) ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20' : ''}
        `}
        onClick={handleClick}
        whileHover={gameState === 'playing' && !gameOver ? { scale: 1.01 } : {}}
        whileTap={gameState === 'playing' && !gameOver ? { scale: 0.99 } : {}}
      >
        {/* Obstacles (Rage Mode) */}
        {gameMode === 'rage' && (gameState === 'playing' || gameState === 'finished') && obstacles.map(obstacle => (
          <motion.div
            key={obstacle.id}
            className="absolute rounded-full bg-red-500 opacity-80"
            style={{
              left: `${obstacle.x}%`,
              top: `${obstacle.y}%`,
              width: `${obstacle.size}%`,
              height: `${obstacle.size}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <FaSkull className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
          </motion.div>
        ))}
        
        {/* Click animations */}
        {clickPositions.map(pos => (
          <motion.div
            key={pos.id}
            className="absolute w-8 h-8 -ml-4 -mt-4 pointer-events-none"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-70" />
          </motion.div>
        ))}
        
        {/* Idle state */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <motion.h2
              className="text-xl md:text-2xl font-bold text-center mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              How fast can you click?
            </motion.h2>
            
            <motion.p
              className="text-gray-600 dark:text-gray-300 text-center mb-4 text-sm max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Click as many times as possible in 1 second!
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              <motion.button
                onClick={() => startGame('normal')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium shadow-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FaPlay className="mr-2" /> Normal Mode
              </motion.button>
              
              <motion.button
                onClick={() => startGame('rage')}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-medium shadow-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FaSkull className="mr-2" /> Rage Mode
              </motion.button>
            </div>
            
            <div className="flex gap-4 text-xs text-center mt-2">
              <div>
                <p className="text-gray-500">Normal High Score</p>
                <p className="font-bold">{highScore}</p>
              </div>
              <div>
                <p className="text-gray-500">Rage High Score</p>
                <p className="font-bold">{rageHighScore}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Countdown state */}
        {gameState === 'countdown' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg"
            >
              {countdown}
            </motion.div>
          </motion.div>
        )}
        
        {/* Playing state */}
        {gameState === 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="text-4xl md:text-6xl font-bold text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ duration: 0.3 }}
            >
              {clicks}
            </motion.div>
            
            <motion.div
              className="absolute top-2 left-2 right-2 flex flex-col"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium">Time left</span>
                <span className="text-xs font-medium">{timeLeft.toFixed(1)}s</span>
              </div>
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${getProgressColor()}`}
                  style={{ width: `${(timeLeft / 1) * 100}%` }}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 1) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
            
            {gameMode === 'rage' && (
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-xs font-medium text-red-500">Avoid the obstacles!</p>
              </div>
            )}
          </div>
        )}
        
        {/* Finished state with results */}
        {gameState === 'finished' && showResults && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl font-bold mb-1">{gameOver ? 'Game Over!' : 'Time\'s Up!'}</h2>
              
              <div className="mb-3">
                <p className="text-gray-600 dark:text-gray-300 text-xs mb-1">Your score:</p>
                <div className="flex items-center justify-center">
                  <motion.div
                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {clicks}
                  </motion.div>
                  <span className="ml-1 text-sm font-medium">clicks</span>
                </div>
              </div>
              
              {isNewHighScore && !gameOver && (
                <motion.div
                  className="mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full inline-block text-xs"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  🏆 New High Score! 🏆
                </motion.div>
              )}
            </motion.div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <motion.button
                onClick={() => startGame(gameMode)}
                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-md flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FaRedo className="mr-1" /> Play Again
              </motion.button>
              
              <motion.button
                onClick={() => startGame(gameMode === 'normal' ? 'rage' : 'normal')}
                className={`px-3 py-1 bg-gradient-to-r ${gameMode === 'normal' ? 'from-red-500 to-orange-500' : 'from-blue-500 to-purple-600'} text-white rounded-full text-sm font-medium shadow-md flex items-center`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {gameMode === 'normal' ? <FaSkull className="mr-1" /> : <FaPlay className="mr-1" />}
                {gameMode === 'normal' ? 'Try Rage Mode' : 'Try Normal Mode'}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Game stats */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-md text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Normal High Score</p>
          <p className="text-lg font-bold">{highScore}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-md text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Rage High Score</p>
          <p className="text-lg font-bold">{rageHighScore}</p>
        </div>
      </div>
      
      {/* Tips section */}
      {gameState === 'idle' && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-md text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-bold mb-1 text-sm">Pro Tips:</h3>
          <ul className="text-gray-600 dark:text-gray-300 space-y-1">
            <li className="flex items-start">
              <span className="text-blue-500 mr-1">•</span>
              Use multiple fingers for faster clicking.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-1">•</span>
              On mobile, try tapping with multiple fingers.
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  );
}
