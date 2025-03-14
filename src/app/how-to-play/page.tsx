'use client';

import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaGamepad, FaInfoCircle, FaArrowRight, FaFire, FaLaugh, FaVoteYea, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function HowToPlayPage() {
  const gameInstructions = [
    {
      id: 'speed-click',
      title: 'Speed Click',
      description: 'Test your clicking speed and reflexes in this fast-paced game.',
      icon: <FaGamepad className="text-blue-500" />,
      instructions: [
        'Click the "Start Game" button to begin',
        'When the countdown ends, tap/click as many times as possible within 1 second',
        'Try to get the highest score possible',
        'In Rage Mode, avoid clicking on the red obstacles that appear'
      ],
      tips: [
        'Use multiple fingers on mobile for faster tapping',
        'Position your hand comfortably before starting',
        'Focus on speed rather than accuracy in standard mode'
      ]
    },
    {
      id: 'you-laugh-you-lose',
      title: 'You Laugh You Lose',
      description: 'Try not to laugh at hilarious content while your webcam watches.',
      icon: <FaLaugh className="text-yellow-500" />,
      instructions: [
        'Allow camera access when prompted',
        'The game will show you funny jokes and content',
        'Try to keep a straight face as long as possible',
        'You lose points if the AI detects you smiling or laughing'
      ],
      tips: [
        'Play in a well-lit room for better face detection',
        'Try thinking of something sad to keep from laughing',
        'Challenge friends to see who can last the longest'
      ]
    },
    {
      id: 'ai-roast-me',
      title: 'AI Roast Me',
      description: 'Get roasted by our AI in the most hilarious way.',
      icon: <FaFire className="text-red-500" />,
      instructions: [
        'Enter a fact about yourself or upload a photo',
        'Our AI will generate a humorous roast',
        'Rate the roast to earn points',
        'Share your favorite roasts with friends'
      ],
      tips: [
        'The more specific your input, the funnier the roast',
        'Don\'t take the roasts personally - it\'s all in good fun',
        'Try different types of inputs for varied results'
      ]
    },
    {
      id: 'would-you-rather',
      title: 'Would You Rather',
      description: 'Make tough choices and see how your answers compare to others.',
      icon: <FaVoteYea className="text-purple-500" />,
      instructions: [
        'You\'ll be presented with two options',
        'Choose the option you prefer',
        'After selecting, you\'ll see how your choice compares with other players',
        'Continue through multiple rounds to earn points'
      ],
      tips: [
        'Answer honestly for the most interesting results',
        'Try to predict what most people would choose for bonus points',
        'The more unusual your choices, the more interesting the game becomes'
      ]
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-primary">How to Play</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Learn how to play our viral games and dominate the leaderboards with these helpful tips and instructions.
          </p>
        </motion.div>

        {/* Game instructions */}
        <div className="space-y-16">
          {gameInstructions.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl">{game.icon}</div>
                  <h2 className="text-2xl font-bold">{game.title}</h2>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8">{game.description}</p>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Instructions */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaInfoCircle className="mr-2 text-blue-500" /> Instructions
                    </h3>
                    <ul className="space-y-3">
                      {game.instructions.map((instruction, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 w-6 h-6 rounded-full mr-3 flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Tips */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                      <FaCheck className="mr-2 text-green-500" /> Pro Tips
                    </h3>
                    <ul className="space-y-3">
                      {game.tips.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 w-6 h-6 rounded-full mr-3 flex-shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Link
                    href={`/games/${game.id}`}
                    className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-full transition-colors"
                  >
                    Play {game.title} <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* General tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">General Gaming Tips</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-bold mb-3">Create an Account</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up to track your progress, save scores, and compete on global leaderboards.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-bold mb-3">Practice Regularly</h3>
              <p className="text-gray-600 dark:text-gray-300">
                The more you play, the better you'll get. Try to play a little each day to improve.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-bold mb-3">Challenge Friends</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Games are more fun with friends! Share your scores and challenge others to beat them.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
} 