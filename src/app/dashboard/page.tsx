'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaTrophy, 
  FaFire, 
  FaHistory, 
  FaSearch, 
  FaGamepad, 
  FaStar, 
  FaChartLine,
  FaLightbulb,
  FaRandom,
  FaClock,
  FaMedal,
  FaCalendarAlt
} from 'react-icons/fa';
import GameEmbed from '@/components/games/GameEmbed';
import GameCard from '@/components/games/GameCard';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Sample game data
  const games = [
    {
      id: 'speed-click',
      title: 'Speed Click',
      description: 'Test your clicking speed and reflexes in this fast-paced game.',
      imageUrl: '/images/Who_can_click_the_fatest.jpg',
      playerCount: '21.5K',
      isNew: false,
      isTrending: true,
      lastPlayed: '2 hours ago',
      highScore: 42,
      category: 'reflex'
    },
    {
      id: 'you-laugh-you-lose',
      title: 'You Laugh You Lose',
      description: 'Try not to laugh at hilarious content while your webcam watches.',
      imageUrl: '/images/you_laugh_you_lose.jpg',
      playerCount: '9.2K',
      isNew: true,
      isTrending: false,
      lastPlayed: 'Never played',
      highScore: null,
      category: 'funny'
    },
    {
      id: 'ai-roast-me',
      title: 'AI Roast Me',
      description: 'Get roasted by our AI in the most hilarious way.',
      imageUrl: '/images/ai_roast_me.jpg',
      playerCount: '8.7K',
      isNew: true,
      isTrending: true,
      lastPlayed: 'Yesterday',
      highScore: 78,
      category: 'funny'
    },
    {
      id: 'escape-viral-trend',
      title: 'Escape the Viral Trend',
      description: 'Solve puzzles based on trending social media crazes before time runs out.',
      imageUrl: '/images/Escape_the_viral_trend.jpg',
      playerCount: '15.3K',
      isNew: true,
      isTrending: false,
      lastPlayed: '3 days ago',
      highScore: 65,
      category: 'puzzle'
    },
    {
      id: 'would-you-rather',
      title: 'Would You Rather?',
      description: 'Face impossible choices and see how your answers compare with others.',
      imageUrl: '/images/would_you_rather.jpg',
      playerCount: '12.8K',
      isNew: true,
      isTrending: true,
      lastPlayed: 'Never played',
      highScore: null,
      category: 'social'
    }
  ];

  // Sample player stats
  const playerStats = {
    totalGamesPlayed: 47,
    totalTimePlayed: '12h 34m',
    highestScore: {
      game: 'Speed Click',
      score: 42
    },
    rank: 1243,
    lastActive: 'Today',
    achievements: 8
  };

  // Categories
  const categories = [
    { id: 'all', name: 'All Games', icon: <FaGamepad /> },
    { id: 'trending', name: 'Trending', icon: <FaFire /> },
    { id: 'new', name: 'New Games', icon: <FaStar /> },
    { id: 'reflex', name: 'Reflex', icon: <FaChartLine /> },
    { id: 'funny', name: 'Funny', icon: <FaLightbulb /> },
    { id: 'puzzle', name: 'Puzzle', icon: <FaRandom /> },
    { id: 'social', name: 'Social', icon: <FaTrophy /> },
  ];

  // Filter games based on search query and category
  const filteredGames = games.filter(game => {
    const matchesSearch = 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'trending') return matchesSearch && game.isTrending;
    if (activeCategory === 'new') return matchesSearch && game.isNew;
    return matchesSearch && game.category === activeCategory;
  });

  // Recently played games (excluding never played)
  const recentlyPlayed = games.filter(game => game.lastPlayed !== 'Never played');

  // Handle play game
  const handlePlayGame = (gameId: string) => {
    setActiveGame(gameId);
    
    // Track game play in analytics (if implemented)
    // analytics.trackEvent('game_play', { gameId });
  };

  // Handle close game
  const handleCloseGame = () => {
    setActiveGame(null);
  };

  // Hide welcome message after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Get a random featured game
  const featuredGame = games[Math.floor(Math.random() * games.length)];

  return (
    <div>
      {/* Active game overlay */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              // Close if clicking the backdrop (not the game container)
              if (e.target === e.currentTarget) {
                handleCloseGame();
              }
            }}
          >
            <div className="w-full max-w-5xl">
              <GameEmbed gameId={activeGame} onClose={handleCloseGame} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome message */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="mb-8 bg-gradient-to-r from-primary to-secondary p-6 rounded-xl text-white shadow-lg"
          >
            <h1 className="text-3xl font-bold mb-2">Welcome back, Player!</h1>
            <p className="text-white/80">
              Ready to play some games and climb the leaderboards? We've added new games for you to enjoy!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero section with featured game */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 sm:mb-12 relative overflow-hidden rounded-xl shadow-xl"
      >
        <div className="relative h-64 sm:h-80 md:h-96">
          <Image
            src={featuredGame.imageUrl}
            alt={featuredGame.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 w-full">
              <div className="flex items-center space-x-2 mb-2">
                {featuredGame.isNew && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
                {featuredGame.isTrending && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <FaFire className="mr-1" /> Trending
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{featuredGame.title}</h2>
              <p className="text-white/80 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 max-w-2xl line-clamp-2 sm:line-clamp-none">{featuredGame.description}</p>
              <button
                onClick={() => handlePlayGame(featuredGame.id)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-secondary hover:bg-secondary-hover text-white rounded-full flex items-center transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <FaPlay className="mr-2" /> Play Featured Game
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaChartLine className="mr-2 text-gray-500" /> Your Stats
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card dark:glass-card-dark p-3 sm:p-4 flex flex-col items-center justify-center text-center"
          >
            <FaGamepad className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-primary" />
            <h3 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Games Played</h3>
            <p className="text-xl sm:text-2xl font-bold">{playerStats.totalGamesPlayed}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card dark:glass-card-dark p-3 sm:p-4 flex flex-col items-center justify-center text-center"
          >
            <FaClock className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-blue-500" />
            <h3 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Time Played</h3>
            <p className="text-xl sm:text-2xl font-bold">{playerStats.totalTimePlayed}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card dark:glass-card-dark p-3 sm:p-4 flex flex-col items-center justify-center text-center"
          >
            <FaTrophy className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-yellow-500" />
            <h3 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Highest Score</h3>
            <p className="text-xl sm:text-2xl font-bold">{playerStats.highestScore.score}</p>
            <p className="text-xs text-gray-500">{playerStats.highestScore.game}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card dark:glass-card-dark p-3 sm:p-4 flex flex-col items-center justify-center text-center"
          >
            <FaMedal className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-secondary" />
            <h3 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Global Rank</h3>
            <p className="text-xl sm:text-2xl font-bold">#{playerStats.rank}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card dark:glass-card-dark p-3 sm:p-4 flex flex-col items-center justify-center text-center"
          >
            <FaCalendarAlt className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-green-500" />
            <h3 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last Active</h3>
            <p className="text-xl sm:text-2xl font-bold">{playerStats.lastActive}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card dark:glass-card-dark p-3 sm:p-4 flex flex-col items-center justify-center text-center"
          >
            <FaStar className="text-2xl sm:text-3xl mb-1 sm:mb-2 text-purple-500" />
            <h3 className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Achievements</h3>
            <p className="text-xl sm:text-2xl font-bold">{playerStats.achievements}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and categories */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold">Browse Games</h2>
          
          <div className="relative w-full sm:w-auto max-w-md">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <div className="flex space-x-2 min-w-max">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id === activeCategory ? 'all' : category.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Recently played section */}
      {recentlyPlayed.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaHistory className="mr-2 text-gray-500" /> Recently Played
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyPlayed.slice(0, 3).map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-modern dark:card-modern-dark overflow-hidden rounded-xl shadow-lg"
              >
                <div className="relative h-40">
                  <Image
                    src={game.imageUrl}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-bold text-lg">{game.title}</h3>
                      <p className="text-sm opacity-80">Last played: {game.lastPlayed}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex justify-between items-center">
                  {game.highScore !== null ? (
                    <div className="flex items-center">
                      <FaTrophy className="text-yellow-500 mr-2" />
                      <span>High Score: {game.highScore}</span>
                    </div>
                  ) : (
                    <div>No high score yet</div>
                  )}
                  
                  <motion.button
                    onClick={() => handlePlayGame(game.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-full flex items-center transition-all"
                  >
                    <FaPlay className="mr-1" /> Play
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* All games section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaGamepad className="mr-2 text-gray-500" /> 
          {activeCategory === 'all' ? 'All Games' : 
           activeCategory === 'trending' ? 'Trending Games' :
           activeCategory === 'new' ? 'New Games' :
           `${categories.find(c => c.id === activeCategory)?.name} Games`}
        </h2>
        
        {filteredGames.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card dark:glass-card-dark p-8 text-center rounded-xl"
          >
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">No games found matching "{searchQuery}"</p>
            <motion.button
              onClick={() => setSearchQuery('')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-primary text-white rounded-full inline-flex items-center"
            >
              Clear Search
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                description={game.description}
                imageUrl={game.imageUrl}
                playerCount={game.playerCount}
                isNew={game.isNew}
                isTrending={game.isTrending}
                category={game.category}
                lastPlayed={game.lastPlayed}
                highScore={game.highScore}
                onPlay={handlePlayGame}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
} 