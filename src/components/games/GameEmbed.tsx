'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, 
  FaTrophy, FaInfoCircle, FaShareAlt, FaHeart, FaThumbsUp,
  FaDownload, FaRedo, FaQuestion, FaChevronLeft, FaChevronRight,
  FaLightbulb, FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope
} from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import confetti from 'canvas-confetti';

// Game components will be loaded dynamically
const gameComponents: Record<string, ComponentType<{isEmbedded?: boolean}>> = {
  'speed-click': dynamic(() => {
    // Try to load enhanced version first, fall back to original
    try {
      return import('@/components/games/enhanced/SpeedClick');
    } catch (e) {
      console.log('Enhanced SpeedClick not found, using original');
      return import('@/components/games/SpeedClick');
    }
  }),
  'you-laugh-you-lose': dynamic(() => import('@/components/games/YouLaughYouLose')),
  'ai-roast-me': dynamic(() => import('@/components/games/AIRoastMe')),
  'escape-viral-trend': dynamic(() => import('@/components/games/EscapeViralTrend')),
  'would-you-rather': dynamic(() => import('@/components/games/WouldYouRather')),
};

// Game background themes
const gameThemes: Record<string, string> = {
  'speed-click': 'from-blue-500/20 via-purple-500/10 to-pink-500/20',
  'you-laugh-you-lose': 'from-yellow-500/20 via-orange-500/10 to-red-500/20',
  'ai-roast-me': 'from-red-500/20 via-purple-500/10 to-blue-500/20',
  'escape-viral-trend': 'from-green-500/20 via-teal-500/10 to-blue-500/20',
  'would-you-rather': 'from-indigo-500/20 via-purple-500/10 to-pink-500/20',
};

// Game accent colors
const gameAccentColors: Record<string, string> = {
  'speed-click': 'bg-gradient-to-r from-blue-500 to-purple-500',
  'you-laugh-you-lose': 'bg-gradient-to-r from-yellow-500 to-red-500',
  'ai-roast-me': 'bg-gradient-to-r from-red-500 to-blue-500',
  'escape-viral-trend': 'bg-gradient-to-r from-green-500 to-blue-500',
  'would-you-rather': 'bg-gradient-to-r from-indigo-500 to-pink-500',
};

interface GameEmbedProps {
  gameId: string;
  onClose: () => void;
}

export default function GameEmbed({ gameId, onClose }: GameEmbedProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const GameComponent = gameComponents[gameId];
  const gameTheme = gameThemes[gameId] || 'from-gray-500/10 via-gray-400/5 to-gray-500/10';
  const gameAccent = gameAccentColors[gameId] || 'bg-gradient-to-r from-purple-500 to-indigo-500';

  // Game tips based on the game type
  const gameTips = {
    'speed-click': [
      "Click as fast as you can when the timer starts!",
      "Try using multiple fingers for faster clicking.",
      "The game measures your clicks per second (CPS).",
      "Practice makes perfect - your speed will improve over time!"
    ],
    'you-laugh-you-lose': [
      "Try to keep a straight face no matter what!",
      "The AI will detect even the slightest smile.",
      "Each round gets progressively harder.",
      "Challenge friends to beat your score!"
    ],
    'ai-roast-me': [
      "The funnier your submission, the better the roast!",
      "You can submit photos or text for roasting.",
      "Don't take the roasts personally - it's all in good fun!",
      "Rate the roasts to help improve the AI."
    ],
    'escape-viral-trend': [
      "Pay attention to social media clues to solve puzzles.",
      "The timer counts down faster as you progress.",
      "Look for hidden patterns in the viral trends.",
      "Some puzzles require knowledge of recent internet phenomena."
    ],
    'would-you-rather': [
      "There are no right or wrong answers!",
      "Your choices are compared with other players globally.",
      "Some questions have surprising statistics!",
      "The more you play, the more interesting the questions become."
    ]
  }[gameId] || ["Have fun playing!", "Challenge your friends to beat your score!"];

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    } else if (containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you would control the actual audio here
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    if (!isFavorite) {
      // Trigger confetti when favoriting
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 }
      });
    }
  };

  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  const toggleTips = () => {
    setShowTips(!showTips);
  };

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % gameTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + gameTips.length) % gameTips.length);
  };

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide controls after inactivity
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      setShowControls(true);
      
      inactivityTimer = setTimeout(() => {
        if (!isLoading && !showTips && !showShareOptions) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    resetTimer();
    
    const handleMouseMove = () => resetTimer();
    const handleMouseClick = () => resetTimer();
    const handleTouchStart = () => resetTimer();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);
    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isLoading, showTips, showShareOptions]);

  // Handle escape key to exit fullscreen or close the game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
      
      // Show controls on any key press
      setShowControls(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, onClose]);

  if (!GameComponent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Sorry, we couldn't find the game you're looking for.
        </p>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-md"
        >
          Back to Dashboard
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden relative
        ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'relative'}
      `}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gameTheme} -z-10`}></div>
      
      {/* Animated particles for visual interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white opacity-20"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              scale: Math.random() * 0.5 + 0.5 
            }}
            animate={{ 
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              opacity: [0.1, 0.3, 0.1],
              scale: [Math.random() * 0.5 + 0.5, Math.random() * 1 + 0.5]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: Math.random() * 10 + 10,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="absolute inset-0 bg-white dark:bg-gray-800 z-20 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-24 h-24 mb-4">
              <motion.div 
                className={`absolute inset-0 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-2 border-4 border-t-transparent border-r-blue-500 border-b-transparent border-l-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.p 
              className="text-lg font-medium text-gray-600 dark:text-gray-300"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading {gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}...
            </motion.p>
            
            {/* Random tip while loading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 max-w-md text-center px-6"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                <FaLightbulb className="inline mr-2 text-yellow-500" />
                Tip: {gameTips[Math.floor(Math.random() * gameTips.length)]}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game header with controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white drop-shadow-md mr-2">
                {gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h2>
              <motion.button
                onClick={toggleFavorite}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 ${isFavorite ? 'text-red-500' : 'text-white'} hover:text-red-400 transition-colors`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <FaHeart className={isFavorite ? 'animate-heartbeat' : ''} />
              </motion.button>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-3">
              <motion.button
                onClick={toggleTips}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 ${showTips ? 'text-yellow-400' : 'text-white'} hover:text-yellow-300 transition-colors`}
                aria-label="Game tips"
              >
                <FaQuestion />
              </motion.button>
              
              <motion.button
                onClick={toggleShareOptions}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 ${showShareOptions ? 'text-blue-400' : 'text-white'} hover:text-blue-300 transition-colors`}
                aria-label="Share game"
              >
                <FaShareAlt />
              </motion.button>
              
              <motion.button
                onClick={toggleMute}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white hover:text-gray-200 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </motion.button>
              
              {!isMobile && (
                <motion.button
                  onClick={toggleFullscreen}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-white hover:text-gray-200 transition-colors"
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </motion.button>
              )}
              
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white hover:text-red-300 transition-colors"
                aria-label="Close game"
              >
                <FaTimes />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game tips overlay */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Game Tips</h3>
                <motion.button
                  onClick={toggleTips}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </motion.button>
              </div>
              
              <div className="relative overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={currentTip}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 min-h-[100px] flex items-center"
                  >
                    <p className="text-gray-700 dark:text-gray-300">
                      <span className="text-yellow-500 mr-2">💡</span>
                      {gameTips[currentTip]}
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                <div className="flex justify-between items-center">
                  <motion.button
                    onClick={prevTip}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 ${gameAccent} text-white rounded-full`}
                  >
                    <FaChevronLeft />
                  </motion.button>
                  
                  <div className="flex space-x-1">
                    {gameTips.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${currentTip === index ? gameAccent : 'bg-gray-300 dark:bg-gray-600'}`}
                      />
                    ))}
                  </div>
                  
                  <motion.button
                    onClick={nextTip}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 ${gameAccent} text-white rounded-full`}
                  >
                    <FaChevronRight />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Share options overlay */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Share This Game</h3>
                <motion.button
                  onClick={toggleShareOptions}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </motion.button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { name: 'Facebook', icon: <FaFacebook className="text-blue-600" />, color: 'bg-blue-100 dark:bg-blue-900/30' },
                  { name: 'Twitter', icon: <FaTwitter className="text-blue-400" />, color: 'bg-blue-50 dark:bg-blue-900/20' },
                  { name: 'WhatsApp', icon: <FaWhatsapp className="text-green-500" />, color: 'bg-green-100 dark:bg-green-900/30' },
                  { name: 'Email', icon: <FaEnvelope className="text-gray-600 dark:text-gray-400" />, color: 'bg-gray-100 dark:bg-gray-700' }
                ].map((platform) => (
                  <motion.button
                    key={platform.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`${platform.color} p-4 rounded-lg flex flex-col items-center justify-center`}
                  >
                    <div className="text-2xl mb-2">{platform.icon}</div>
                    <span className="text-sm">{platform.name}</span>
                  </motion.button>
                ))}
              </div>
              
              <div className="relative flex items-center mb-4">
                <input
                  type="text"
                  value={`https://speedtap-arena.com/games/${gameId}`}
                  readOnly
                  className="w-full px-4 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-2 px-3 py-1 bg-blue-500 text-white text-sm rounded"
                >
                  Copy
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game component */}
      <div className="relative h-full min-h-[500px] md:min-h-[600px] flex items-center justify-center">
        {!isLoading && <GameComponent isEmbedded={true} />}
      </div>
      
      {/* Bottom controls - Removed duplicate restart and leaderboard buttons */}
      <AnimatePresence>
        {showControls && !isLoading && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex space-x-2">
              <motion.button
                onClick={toggleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center shadow-lg"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <FaCompress className="mr-2" /> : <FaExpand className="mr-2" />}
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS for animations */}
      <style jsx global>{`
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out;
        }
        
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1); }
          75% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        
        /* Fix for mobile devices */
        @media (max-width: 640px) {
          .game-embed-container {
            border-radius: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
          }
        }
      `}</style>
    </motion.div>
  );
} 