'use client';

import { motion } from 'framer-motion';
import { FaGamepad, FaTrophy, FaUsers, FaShareAlt } from 'react-icons/fa';

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaGamepad className="text-purple-600 text-4xl" />,
      title: 'Multiple Games',
      description: 'Access a variety of viral games all in one place, with new games added regularly.',
    },
    {
      icon: <FaTrophy className="text-pink-600 text-4xl" />,
      title: 'Leaderboards',
      description: 'Compete with players worldwide and see your name on our global leaderboards.',
    },
    {
      icon: <FaUsers className="text-blue-600 text-4xl" />,
      title: 'Community',
      description: 'Join a growing community of players, share strategies, and make new friends.',
    },
    {
      icon: <FaShareAlt className="text-green-600 text-4xl" />,
      title: 'Social Sharing',
      description: 'Share your achievements and challenge friends on your favorite social platforms.',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ViralArcade?</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We've created the ultimate gaming platform with features designed to enhance your gaming experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl text-center"
          >
            <div className="text-5xl font-bold mb-2">1M+</div>
            <div className="text-xl">Active Players</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-r from-pink-600 to-red-600 text-white p-8 rounded-xl text-center"
          >
            <div className="text-5xl font-bold mb-2">4+</div>
            <div className="text-xl">Viral Games</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8 rounded-xl text-center"
          >
            <div className="text-5xl font-bold mb-2">10M+</div>
            <div className="text-xl">Games Played</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 