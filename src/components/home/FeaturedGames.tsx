'use client';

import { motion } from 'framer-motion';
import GameCard from '../games/GameCard';

// Sample game data
const featuredGames = [
  {
    id: 'ai-roast-me',
    title: 'AI Roast Me',
    description: 'Submit your photo or a fun fact and get humorously "roasted" by our AI. Can you handle the heat?',
    imageUrl: '/images/ai_roast_me.jpg',
    playerCount: 8700,
    isNew: true,
    isTrending: true,
  },
  {
    id: 'escape-viral-trend',
    title: 'Escape the Viral Trend',
    description: 'Solve daily puzzles based on trending social media crazes before time runs out. New challenges every day!',
    imageUrl: '/images/Escape_the_viral_trend.jpg',
    playerCount: 15300,
    isNew: true,
    isTrending: true,
  },
  {
    id: 'speed-click',
    title: 'Who Can Click the Fastest?',
    description: 'You have 1 second to click as many times as possible. Compete globally in this addictive speed challenge!',
    imageUrl: '/images/Who_can_click_the_fatest.jpg',
    playerCount: 21500,
    isNew: false,
    isTrending: true,
  },
  {
    id: 'you-laugh-you-lose',
    title: 'You Laugh, You Lose',
    description: 'AI generates funny content while your webcam detects if you smile or laugh. How long can you keep a straight face?',
    imageUrl: '/images/you_laugh_you_lose.jpg',
    playerCount: 9200,
    isNew: true,
    isTrending: false,
  },
];

export default function FeaturedGames() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Games</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our most popular games that are taking the internet by storm. Challenge yourself and share with friends!
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredGames.map((game) => (
            <motion.div key={game.id} variants={itemVariants}>
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
        </motion.div>
      </div>
    </section>
  );
} 