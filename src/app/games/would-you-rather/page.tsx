'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShareAlt, FaTrophy, FaVoteYea } from 'react-icons/fa';
import Link from 'next/link';
import Confetti from 'react-confetti';

// Sample would you rather questions
const wouldYouRatherQuestions = [
  {
    id: 1,
    optionA: 'Have the ability to fly',
    optionB: 'Have the ability to read minds',
    stats: { optionA: 65, optionB: 35 }
  },
  {
    id: 2,
    optionA: 'Be a famous movie star',
    optionB: 'Be a famous scientist',
    stats: { optionA: 48, optionB: 52 }
  },
  {
    id: 3,
    optionA: 'Live in a world with no internet',
    optionB: 'Live in a world with no air conditioning or heating',
    stats: { optionA: 22, optionB: 78 }
  },
  {
    id: 4,
    optionA: 'Have unlimited money but no friends',
    optionB: 'Have amazing friends but always be broke',
    stats: { optionA: 31, optionB: 69 }
  },
  {
    id: 5,
    optionA: 'Know how you will die',
    optionB: 'Know when you will die',
    stats: { optionA: 42, optionB: 58 }
  },
  {
    id: 6,
    optionA: 'Be able to teleport but only to places you\'ve been before',
    optionB: 'Be able to fly but only at walking speed',
    stats: { optionA: 83, optionB: 17 }
  },
  {
    id: 7,
    optionA: 'Have a photographic memory',
    optionB: 'Have an IQ of 200',
    stats: { optionA: 61, optionB: 39 }
  },
  {
    id: 8,
    optionA: 'Be fluent in all languages',
    optionB: 'Be a master of all musical instruments',
    stats: { optionA: 74, optionB: 26 }
  },
];

export default function WouldYouRatherPage() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<'A' | 'B' | null>>([]);
  const [showStats, setShowStats] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQuestion = wouldYouRatherQuestions[currentQuestionIndex];

  // Start the game
  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(wouldYouRatherQuestions.length).fill(null));
    setScore(0);
    setShowStats(false);
  };

  // Handle answer selection
  const handleAnswerSelect = (option: 'A' | 'B') => {
    if (showStats) return; // Prevent selection when showing stats
    
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newSelectedAnswers);
    
    // Show stats after selection
    setShowStats(true);
    
    // Add points based on how many people agree with you
    const pointsForAgreement = option === 'A' 
      ? Math.round(currentQuestion.stats.optionA) 
      : Math.round(currentQuestion.stats.optionB);
    
    setScore(prev => prev + pointsForAgreement);
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < wouldYouRatherQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowStats(false);
      } else {
        setGameState('result');
        setShowConfetti(true);
        
        // Hide confetti after 5 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    }, 3000);
  };

  return (
    <MainLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="container mx-auto px-4 py-12">
        {/* Game header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/games"
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Games
          </Link>
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Would You Rather?
          </h1>
          
          <Link
            href="/leaderboards"
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
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
                <h2 className="text-2xl font-bold mb-4">The Ultimate Dilemma Game!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Face impossible choices and see how your answers compare with others. Would you rather...?
                </p>
                
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">How to Play:</h3>
                  <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• You'll be presented with two options</li>
                    <li>• Choose the option you prefer</li>
                    <li>• See how your choice compares with other players</li>
                    <li>• Earn points based on how many people agree with you</li>
                    <li>• The more people who agree with you, the more points you get!</li>
                  </ul>
                </div>
                
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                  Start Game
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Playing screen */}
        {gameState === 'playing' && currentQuestion && (
          <div className="max-w-4xl mx-auto">
            {/* Progress */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">
                Question {currentQuestionIndex + 1}/{wouldYouRatherQuestions.length}
              </div>
              <div className="text-sm font-medium">
                Score: {score}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / wouldYouRatherQuestions.length) * 100}%` }}
              ></div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-8">Would you rather...</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option A */}
              <motion.div
                whileHover={!showStats ? { scale: 1.02 } : {}}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                  selectedAnswers[currentQuestionIndex] === 'A' ? 'ring-4 ring-purple-500' : ''
                }`}
                onClick={() => !showStats && handleAnswerSelect('A')}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex-grow flex items-center justify-center text-center p-4">
                    <h3 className="text-xl font-semibold">{currentQuestion.optionA}</h3>
                  </div>
                  
                  {showStats && (
                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-200 text-purple-800">
                              Option A
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-purple-800">
                              {currentQuestion.stats.optionA}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                          <div
                            style={{ width: `${currentQuestion.stats.optionA}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Option B */}
              <motion.div
                whileHover={!showStats ? { scale: 1.02 } : {}}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all ${
                  selectedAnswers[currentQuestionIndex] === 'B' ? 'ring-4 ring-pink-500' : ''
                }`}
                onClick={() => !showStats && handleAnswerSelect('B')}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="flex-grow flex items-center justify-center text-center p-4">
                    <h3 className="text-xl font-semibold">{currentQuestion.optionB}</h3>
                  </div>
                  
                  {showStats && (
                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-pink-200 text-pink-800">
                              Option B
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-pink-800">
                              {currentQuestion.stats.optionB}%
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                          <div
                            style={{ width: `${currentQuestion.stats.optionB}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-pink-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            
            {showStats && (
              <div className="text-center mt-6 text-gray-600 dark:text-gray-400">
                <p>
                  {selectedAnswers[currentQuestionIndex] === 'A' 
                    ? `You agree with ${currentQuestion.stats.optionA}% of players!` 
                    : `You agree with ${currentQuestion.stats.optionB}% of players!`}
                </p>
              </div>
            )}
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
                  Your choices aligned with {Math.round(score / wouldYouRatherQuestions.length)}% of other players on average
                </p>
                
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl mb-8">
                  <div className="text-5xl font-bold mb-2">{score}</div>
                  <div className="text-white/80">Your Score</div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                  >
                    Play Again
                  </button>
                  
                  <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-full border border-purple-200 hover:bg-purple-50 transition-colors flex items-center justify-center">
                    <FaShareAlt className="mr-2" /> Share Results
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