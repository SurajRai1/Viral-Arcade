'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import GameCard from '@/components/games/GameCard';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter } from 'react-icons/fa';

// Sample game data
const allGames = [
  {
    id: 'ai-roast-me',
    title: 'AI Roast Me',
    description: 'Submit your photo or a fun fact and get humorously "roasted" by our AI. Can you handle the heat?',
    imageUrl: '/images/ai_roast_me.jpg',
    playerCount: 8700,
    isNew: true,
    isTrending: true,
    category: 'ai',
  },
  {
    id: 'escape-viral-trend',
    title: 'Escape the Viral Trend',
    description: 'Solve daily puzzles based on trending social media crazes before time runs out. New challenges every day!',
    imageUrl: '/images/Escape_the_viral_trend.jpg',
    playerCount: 15300,
    isNew: true,
    isTrending: true,
    category: 'puzzle',
  },
  {
    id: 'speed-click',
    title: 'Who Can Click the Fastest?',
    description: 'You have 1 second to click as many times as possible. Compete globally in this addictive speed challenge!',
    imageUrl: '/images/Who_can_click_the_fatest.jpg',
    playerCount: 21500,
    isNew: false,
    isTrending: true,
    category: 'action',
  },
  {
    id: 'you-laugh-you-lose',
    title: 'You Laugh, You Lose',
    description: 'AI generates funny content while your webcam detects if you smile or laugh. How long can you keep a straight face?',
    imageUrl: '/images/you_laugh_you_lose.jpg',
    playerCount: 9200,
    isNew: true,
    isTrending: false,
    category: 'ai',
  },
];

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  const categories = [
    { id: 'all', name: 'All Games' },
    { id: 'ai', name: 'AI Games' },
    { id: 'puzzle', name: 'Puzzle Games' },
    { id: 'action', name: 'Action Games' },
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'newest', name: 'Newest First' },
    { id: 'a-z', name: 'A-Z' },
  ];

  // Filter and sort games
  const filteredGames = allGames
    .filter((game) => {
      // Filter by search query
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           game.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by category
      const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortBy === 'popular') {
        return b.playerCount - a.playerCount;
      } else if (sortBy === 'newest') {
        return a.isNew ? -1 : b.isNew ? 1 : 0;
      } else if (sortBy === 'a-z') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Browse Games</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover all our viral games and find your next favorite way to challenge yourself and friends.
          </p>
        </motion.div>

        {/* Search and filters */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category filter */}
            <div className="md:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilter className="text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort options */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Games grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GameCard
                  id={game.id}
                  title={game.title}
                  description={game.description}
                  imageUrl={game.imageUrl}
                  playerCount={game.playerCount}
                  isNew={game.isNew}
                  isTrending={game.isTrending}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-500 mb-2">No games found</h3>
            <p className="text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
} 