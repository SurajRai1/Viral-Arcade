'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTrophy, FaUsers, FaFire, FaStar, FaClock, FaMedal, FaGamepad, FaHeart } from 'react-icons/fa';

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
  highScore?: number | null;
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
  const [isMobile, setIsMobile] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position values for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform mouse position into rotation values
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  const scale = useTransform(y, [-100, 100], [1.03, 0.97]);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isMobile) return;
    
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

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    
    // Add heart animation
    if (!isLiked && cardRef.current) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = '❤️';
      cardRef.current.appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 1000);
    }
  };

  // Get category color
  const getCategoryColor = () => {
    switch(category) {
      case 'reflex': return 'from-blue-500 to-cyan-500';
      case 'funny': return 'from-pink-500 to-purple-500';
      case 'puzzle': return 'from-green-500 to-emerald-500';
      case 'social': return 'from-orange-500 to-amber-500';
      default: return 'from-indigo-500 to-violet-500';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="game-card bg-white dark:bg-gray-800 h-full flex flex-col rounded-xl overflow-hidden shadow-lg relative"
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        scale: isMobile ? 1 : scale,
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
            className={`absolute -inset-0.5 bg-gradient-to-r ${getCategoryColor()} rounded-xl opacity-75 blur-sm -z-10`}
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
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        
        {/* Overlay gradient */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 transition-opacity duration-300`}
          style={{ opacity: isHovered ? '0.8' : '0.6' }}
        />
        
        {/* Game category icon */}
        <div className="absolute top-3 left-3 z-10">
          <motion.div 
            className={`w-10 h-10 rounded-full bg-gradient-to-r ${getCategoryColor()} flex items-center justify-center shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 10 }}
          >
            {category === 'reflex' && <FaGamepad className="text-white" />}
            {category === 'funny' && <FaStar className="text-white" />}
            {category === 'puzzle' && <FaFire className="text-white" />}
            {category === 'social' && <FaUsers className="text-white" />}
            {!category && <FaGamepad className="text-white" />}
          </motion.div>
        </div>
        
        {/* Badges with staggered animation */}
        <div className="absolute top-3 right-3 flex gap-2 flex-wrap">
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
        </div>
        
        {/* Game title overlay */}
        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-lg md:text-xl font-bold text-white">{title}</h3>
        </div>
        
        {/* Play button overlay with improved animation */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
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
            className={`bg-white text-purple-600 rounded-full p-4 shadow-lg`}
            aria-label={`Play ${title}`}
          >
            <FaPlay size={24} />
          </motion.button>
        </motion.div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <FaUsers className="mr-1 text-blue-500" />
              {typeof playerCount === 'string' ? playerCount : playerCount.toLocaleString()}
            </span>
          </div>
          
          <motion.button
            onClick={toggleLike}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            className={`p-2 rounded-full ${isLiked ? 'text-red-500' : 'text-gray-400 dark:text-gray-600'}`}
            aria-label={isLiked ? "Unlike game" : "Like game"}
          >
            <FaHeart className={isLiked ? 'animate-heartbeat' : ''} />
          </motion.button>
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
          {highScore !== undefined && highScore !== null && (
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
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor()} text-white rounded-full text-sm font-medium flex items-center shadow-md`}
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
      
      {/* CSS for animations */}
      <style jsx global>{`
        .card-click-effect {
          animation: card-click 0.3s forwards;
        }
        
        @keyframes card-click {
          0% { transform: scale(1); }
          50% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        
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
        
        .floating-heart {
          position: absolute;
          top: 50%;
          left: 50%;
          font-size: 2rem;
          pointer-events: none;
          animation: float-up 1s forwards;
        }
        
        @keyframes float-up {
          0% { 
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% { 
            transform: translate(-50%, -150%) scale(1.5);
            opacity: 0;
          }
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .game-card {
            transform: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
} 