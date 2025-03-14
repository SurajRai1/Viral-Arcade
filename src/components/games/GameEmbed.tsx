'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaTrophy, FaInfoCircle, FaShareAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';

// Game components will be loaded dynamically
const gameComponents: Record<string, any> = {
  'speed-click': dynamic(() => import('@/components/games/SpeedClick')),
  'you-laugh-you-lose': dynamic(() => import('@/components/games/YouLaughYouLose')),
  'ai-roast-me': dynamic(() => import('@/components/games/AIRoastMe')),
  'escape-viral-trend': dynamic(() => import('@/components/games/EscapeViralTrend')),
  'would-you-rather': dynamic(() => import('@/components/games/WouldYouRather')),
};

// Game background themes
const gameThemes: Record<string, string> = {
  'speed-click': 'from-blue-500/10 via-purple-500/5 to-pink-500/10',
  'you-laugh-you-lose': 'from-yellow-500/10 via-orange-500/5 to-red-500/10',
  'ai-roast-me': 'from-red-500/10 via-purple-500/5 to-blue-500/10',
  'escape-viral-trend': 'from-green-500/10 via-teal-500/5 to-blue-500/10',
  'would-you-rather': 'from-indigo-500/10 via-purple-500/5 to-pink-500/10',
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
  const containerRef = useRef<HTMLDivElement>(null);
  const GameComponent = gameComponents[gameId];
  const gameTheme = gameThemes[gameId] || 'from-gray-500/10 via-gray-400/5 to-gray-500/10';

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
        if (!isLoading) {
          setShowControls(false);
        }
      }, 3000);
    };
    
    resetTimer();
    
    const handleMouseMove = () => resetTimer();
    const handleMouseClick = () => resetTimer();
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);
    
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
    };
  }, [isLoading]);

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
                className="absolute inset-0 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
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
            <h2 className="text-xl font-bold text-white drop-shadow-md">
              {gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h2>
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={toggleMute}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white hover:text-gray-200 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </motion.button>
              <motion.button
                onClick={toggleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white hover:text-gray-200 transition-colors"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white hover:text-gray-200 transition-colors"
                aria-label="Close game"
              >
                <FaTimes />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game content */}
      <div className={`game-container relative ${isFullscreen ? 'h-[100vh]' : 'h-[600px]'}`}>
        <GameComponent isEmbedded={true} />
      </div>
      
      {/* Game footer with additional controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-gradient-to-t from-black/50 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white hover:text-gray-200 transition-colors flex items-center"
              >
                <FaTrophy className="mr-1" /> Leaderboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white hover:text-gray-200 transition-colors flex items-center"
              >
                <FaInfoCircle className="mr-1" /> How to Play
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-white hover:text-gray-200 transition-colors flex items-center"
            >
              <FaShareAlt className="mr-1" /> Share
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 