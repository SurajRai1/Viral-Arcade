'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShareAlt, FaTrophy, FaVoteYea, FaUserPlus } from 'react-icons/fa';
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

interface WouldYouRatherProps {
  isEmbedded?: boolean;
}

export default function WouldYouRather({ isEmbedded = false }: WouldYouRatherProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<'A' | 'B' | null>>([]);
  const [showStats, setShowStats] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);

  const currentQuestion = wouldYouRatherQuestions[currentQuestionIndex];

  // Start the game
  const startGame = () => {
    // If free trial ended and not embedded, show account prompt
    if (freeTrialEnded && !isEmbedded) {
      setShowAccountPrompt(true);
      return;
    }
    
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
    
    // Auto-advance to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < wouldYouRatherQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowStats(false);
      } else {
        endGame();
      }
    }, 3000);
  };
  
  // End the game
  const endGame = () => {
    setGameState('result');
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    // Set free trial as ended if this is their first game and not embedded
    if (!hasPlayedFreeGame && !isEmbedded) {
      setHasPlayedFreeGame(true);
      setFreeTrialEnded(true);
      
      // Show account prompt after a short delay
      setTimeout(() => {
        setShowAccountPrompt(true);
      }, 1500);
    }
  };
  
  // Share results to social media
  const shareResults = () => {
    // In a real app, this would integrate with social media APIs
    alert(`Sharing results: You scored ${score} points in Would You Rather!`);
  };

  // Add a function to handle account creation redirect
  const handleCreateAccount = () => {
    // Redirect to the signup page with the game name as a query parameter
    window.location.href = '/signup?from=would-you-rather';
  };

  // Add a function to continue without account
  const continueWithoutAccount = () => {
    setShowAccountPrompt(false);
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 500}
          height={typeof window !== 'undefined' ? window.innerHeight : 500}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Account prompt overlay */}
        {showAccountPrompt && !isEmbedded && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold mb-2">You've Completed Your Free Game!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create an account to play unlimited games and save your scores.
              </p>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleCreateAccount}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center"
                >
                  <FaUserPlus className="mr-2" /> Create Free Account
                </button>
                
                <button
                  onClick={continueWithoutAccount}
                  className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
        
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold mb-6">Would You Rather?</h1>
            <p className="text-lg mb-8">
              Face impossible choices and see how your answers compare with others!
            </p>
            
            <button
              onClick={startGame}
              className="py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors mx-auto mb-8 flex items-center justify-center"
            >
              <FaVoteYea className="mr-2" /> Start Game
            </button>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-w-lg mx-auto">
              <h2 className="font-bold text-lg mb-2">How to Play:</h2>
              <ul className="text-left list-disc pl-5 space-y-1">
                <li>You'll be presented with "Would You Rather" scenarios</li>
                <li>Choose the option you prefer</li>
                <li>See how your answers compare with other players</li>
                <li>The more your answers align with the majority, the higher your score</li>
                <li>Answer all questions to see your final score</li>
              </ul>
            </div>
            
            {freeTrialEnded && !isEmbedded && (
              <div className="mt-6 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg max-w-lg mx-auto">
                <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                  You've played your free game! Create an account to continue playing and save your scores.
                </p>
                <button
                  onClick={handleCreateAccount}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Create Free Account
                </button>
              </div>
            )}
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
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-2">Game Complete!</h2>
            <p className="text-lg mb-6">
              You scored <span className="font-bold text-blue-600">{score} points</span>!
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={startGame}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={shareResults}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FaShareAlt className="inline mr-1" /> Share Results
              </button>
            </div>
            
            {freeTrialEnded && !isEmbedded && (
              <div className="mb-8 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 p-4 rounded-lg max-w-lg mx-auto">
                <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                  You've played your free game! Create an account to continue playing and save your scores.
                </p>
                <button
                  onClick={handleCreateAccount}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Create Free Account
                </button>
              </div>
            )}
            
            <div className="max-w-md mx-auto">
              <h3 className="font-bold text-xl mb-4 flex items-center justify-center">
                <FaTrophy className="text-yellow-500 mr-2" /> Your Answers
              </h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {wouldYouRatherQuestions.map((question, index) => {
                  const selected = selectedAnswers[index];
                  const selectedPercentage = selected === 'A' 
                    ? question.stats.optionA 
                    : question.stats.optionB;
                  
                  return (
                    <div 
                      key={question.id}
                      className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold">Question {index + 1}</span>
                        <span className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                          {selected === 'A' ? 'Option A' : 'Option B'}: {Math.round(selectedPercentage)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selected === 'A' ? question.optionA : question.optionB}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 