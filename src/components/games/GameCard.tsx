'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTrophy, FaUsers, FaFire, FaStar, FaClock, FaMedal } from 'react-icons/fa';

interface GameCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  playerCount: number | string;
  isNew?: boolean;
  isTrending?: boolean;
  category?: string;
  lastPlayed?: string;
  highScore?: number;
  onPlay?: (id: string) => void;
}

export default function GameCard({
  id,
  title,
  description,
  imageUrl,
  playerCount,
  isNew = false,
  isTrending = false,
  category,
  lastPlayed,
  highScore,
  onPlay
}: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position values for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse position into rotation values
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Add click effect
    if (cardRef.current) {
      cardRef.current.classList.add('card-click-effect');
      setTimeout(() => {
        cardRef.current?.classList.remove('card-click-effect');
      }, 300);
    }
    
    if (onPlay) {
      onPlay(id);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="game-card bg-white dark:bg-gray-800 h-full flex flex-col rounded-xl overflow-hidden shadow-lg relative"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Glowing border effect when hovered */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-75 blur-sm -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      <div className="relative overflow-hidden aspect-video">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        
        {/* Badges with staggered animation */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {isNew && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-md"
            >
              <FaStar className="mr-1 animate-pulse" /> NEW
            </motion.span>
          )}
          {isTrending && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-md"
            >
              <FaFire className="mr-1 animate-pulse" /> TRENDING
            </motion.span>
          )}
          {category && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
            >
              {category.toUpperCase()}
            </motion.span>
          )}
        </div>
        
        {/* Play button overlay with improved animation */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button 
            onClick={handlePlay}
            whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10
            }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-white text-purple-600 rounded-full p-4 shadow-lg"
          >
            <FaPlay size={24} />
          </motion.button>
        </motion.div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <FaUsers className="mr-1 text-blue-500" />
            {typeof playerCount === 'string' ? playerCount : playerCount.toLocaleString()} players
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
          {description}
        </p>
        
        {/* Game stats with animations */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {lastPlayed && (
            <motion.div 
              className="flex items-center text-xs text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FaClock className="mr-1 text-indigo-400" /> Last played: {lastPlayed}
            </motion.div>
          )}
          {highScore !== undefined && (
            <motion.div 
              className="flex items-center text-xs text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <FaMedal className="mr-1 text-yellow-500" /> High score: {highScore}
            </motion.div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <motion.button 
            onClick={handlePlay}
            whileHover={{ scale: 1.05, x: 3 }}
            className="text-purple-600 dark:text-purple-400 font-medium text-sm hover:underline flex items-center transition-colors hover:text-purple-700 dark:hover:text-purple-300"
          >
            Play Now <FaPlay className="ml-1" size={12} />
          </motion.button>
          
          <Link 
            href={`/leaderboards?game=${id}`}
            className="text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300 flex items-center transition-colors"
          >
            <FaTrophy className="mr-1 text-yellow-500" /> Leaderboard
          </Link>
        </div>
      </div>
      
      {/* CSS for click effect */}
      <style jsx global>{`
        .card-click-effect {
          animation: card-click 0.3s forwards;
        }
        
        @keyframes card-click {
          0% { transform: scale(1); }
          50% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
      `}</style>
    </motion.div>
  );
} 