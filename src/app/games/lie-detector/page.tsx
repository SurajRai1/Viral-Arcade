'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShareAlt, FaTrophy, FaCheck, FaTimes, FaQuestion } from 'react-icons/fa';
import Link from 'next/link';
import Confetti from 'react-confetti';

// Sample statements for the game
const statements = [
  {
    id: 1,
    statement: "The Great Wall of China is visible from space with the naked eye.",
    isTrue: false,
    explanation: "Contrary to popular belief, the Great Wall of China is not visible from space with the naked eye. It's too narrow to be seen without aid."
  },
  {
    id: 2,
    statement: "A day on Venus is longer than a year on Venus.",
    isTrue: true,
    explanation: "Venus rotates very slowly on its axis, taking about 243 Earth days to complete one rotation, while it orbits the Sun in just 225 Earth days."
  },
  {
    id: 3,
    statement: "Humans share 50% of their DNA with bananas.",
    isTrue: true,
    explanation: "Humans share about 50-60% of their DNA with bananas due to our common evolutionary ancestry."
  },
  {
    id: 4,
    statement: "The Eiffel Tower can be 15 cm taller during the summer.",
    isTrue: true,
    explanation: "Due to thermal expansion, the iron structure of the Eiffel Tower can grow up to 15 cm taller in hot summer temperatures."
  },
  {
    id: 5,
    statement: "Goldfish have a memory span of only three seconds.",
    isTrue: false,
    explanation: "Goldfish can actually remember things for months, not just seconds. They can be trained to respond to certain stimuli and recognize their owners."
  },
  {
    id: 6,
    statement: "Lightning never strikes the same place twice.",
    isTrue: false,
    explanation: "Lightning frequently strikes the same place multiple times, especially tall structures like the Empire State Building, which gets hit about 25 times per year."
  },
  {
    id: 7,
    statement: "Humans can distinguish between over a trillion different smells.",
    isTrue: true,
    explanation: "Research suggests that humans can distinguish between at least 1 trillion different odors, far more than previously believed."
  },
  {
    id: 8,
    statement: "The shortest war in history lasted only 38 minutes.",
    isTrue: true,
    explanation: "The Anglo-Zanzibar War of 1896 lasted just 38 minutes, making it the shortest recorded war in history."
  },
  {
    id: 9,
    statement: "A group of flamingos is called a 'flamboyance'.",
    isTrue: true,
    explanation: "A group of flamingos is indeed called a 'flamboyance', reflecting their vibrant and showy appearance."
  },
  {
    id: 10,
    statement: "Chameleons change color to match their surroundings as camouflage.",
    isTrue: false,
    explanation: "Chameleons primarily change color to regulate their temperature and to communicate with other chameleons, not to match their surroundings."
  },
];

export default function LieDetectorPage() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'result'>('intro');
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shuffledStatements, setShuffledStatements] = useState<typeof statements>([]);

  // Shuffle statements when game starts
  useEffect(() => {
    if (gameState === 'playing' && shuffledStatements.length === 0) {
      setShuffledStatements([...statements].sort(() => 0.5 - Math.random()));
    }
  }, [gameState, shuffledStatements.length]);

  const currentStatement = shuffledStatements[currentStatementIndex];

  // Handle timer
  useEffect(() => {
    if (gameState !== 'playing' || !currentStatement) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-select wrong answer if time runs out
          handleAnswerSelect(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, currentStatementIndex, currentStatement]);

  // Start the game
  const startGame = () => {
    setGameState('playing');
    setCurrentStatementIndex(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedAnswer(null);
    setShuffledStatements([...statements].sort(() => 0.5 - Math.random()));
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: boolean | null) => {
    setSelectedAnswer(answer);
    
    // Check if answer is correct
    if (answer === currentStatement?.isTrue) {
      setScore((prev) => prev + 100);
    }
    
    // Show feedback
    setGameState('feedback');
  };

  // Move to next statement or end game
  const handleNextStatement = () => {
    setSelectedAnswer(null);
    
    if (currentStatementIndex < shuffledStatements.length - 1) {
      setCurrentStatementIndex((prev) => prev + 1);
      setTimeLeft(15);
      setGameState('playing');
    } else {
      setGameState('result');
      setShowConfetti(true);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };

  return (
    <MainLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="container mx-auto px-4 py-12">
        {/* Game header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/games"
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Games
          </Link>
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-500 to-teal-600 text-transparent bg-clip-text">
            Lie Detector
          </h1>
          
          <Link
            href="/leaderboards"
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <FaTrophy className="mr-2" /> Leaderboard
          </Link>
        </div>
        
        {/* Intro screen */}
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">Can You Spot the Lies?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Test your knowledge and intuition by determining which statements are true and which are false!
                </p>
                
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">How to Play:</h3>
                  <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• You'll be presented with a series of statements</li>
                    <li>• Decide whether each statement is TRUE or FALSE</li>
                    <li>• You have 15 seconds to make each decision</li>
                    <li>• Earn 100 points for each correct answer</li>
                    <li>• Learn interesting facts along the way!</li>
                  </ul>
                </div>
                
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                  Start Game
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Playing screen */}
        {gameState === 'playing' && currentStatement && (
          <div className="max-w-3xl mx-auto">
            {/* Progress and timer */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">
                Statement {currentStatementIndex + 1}/{shuffledStatements.length}
              </div>
              <div className="text-sm font-medium">
                Score: {score}
              </div>
              <div className={`text-sm font-medium ${timeLeft <= 5 ? 'text-red-500' : ''}`}>
                Time: {timeLeft}s
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-green-500 to-teal-600 h-2 rounded-full"
                style={{ width: `${((currentStatementIndex + 1) / shuffledStatements.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-8">
                {/* Statement */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-6 text-center">"{currentStatement.statement}"</h2>
                </div>
                
                {/* Answer options */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswerSelect(true)}
                    className="p-6 rounded-lg text-center transition-colors bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/50 border border-green-200 dark:border-green-800"
                  >
                    <FaCheck className="text-3xl mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <span className="font-bold text-green-800 dark:text-green-300">TRUE</span>
                  </button>
                  
                  <button
                    onClick={() => handleAnswerSelect(false)}
                    className="p-6 rounded-lg text-center transition-colors bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 border border-red-200 dark:border-red-800"
                  >
                    <FaTimes className="text-3xl mx-auto mb-2 text-red-600 dark:text-red-400" />
                    <span className="font-bold text-red-800 dark:text-red-300">FALSE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Feedback screen */}
        {gameState === 'feedback' && currentStatement && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-8">
                {/* Result */}
                <div className={`p-4 rounded-lg mb-6 ${
                  selectedAnswer === currentStatement.isTrue
                    ? 'bg-green-100 dark:bg-green-900/30 border border-green-500'
                    : 'bg-red-100 dark:bg-red-900/30 border border-red-500'
                }`}>
                  <div className="flex items-center justify-center mb-2">
                    {selectedAnswer === currentStatement.isTrue ? (
                      <>
                        <FaCheck className="text-2xl text-green-600 dark:text-green-400 mr-2" />
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-300">Correct!</h3>
                      </>
                    ) : (
                      <>
                        <FaTimes className="text-2xl text-red-600 dark:text-red-400 mr-2" />
                        <h3 className="text-xl font-bold text-red-800 dark:text-red-300">Incorrect!</h3>
                      </>
                    )}
                  </div>
                  
                  <p className="text-center">
                    The statement "{currentStatement.statement}" is{' '}
                    <span className={currentStatement.isTrue ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {currentStatement.isTrue ? 'TRUE' : 'FALSE'}
                    </span>.
                  </p>
                </div>
                
                {/* Explanation */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">Explanation:</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentStatement.explanation}
                  </p>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={handleNextStatement}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                  >
                    {currentStatementIndex < shuffledStatements.length - 1 ? 'Next Statement' : 'See Results'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Result screen */}
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-2">Game Complete!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You scored {score} out of {shuffledStatements.length * 100} points
                </p>
                
                <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-xl mb-8">
                  <div className="text-5xl font-bold mb-2">{score}</div>
                  <div className="text-white/80">Your Score</div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {score >= 800 
                    ? "Amazing! You're a human lie detector!"
                    : score >= 500
                    ? "Good job! You have a keen eye for the truth."
                    : "Not bad! Keep playing to improve your truth-spotting skills."}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                  >
                    Play Again
                  </button>
                  
                  <button className="px-6 py-3 bg-white text-green-600 font-bold rounded-full border border-green-200 hover:bg-green-50 transition-colors flex items-center justify-center">
                    <FaShareAlt className="mr-2" /> Share Score
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
} 