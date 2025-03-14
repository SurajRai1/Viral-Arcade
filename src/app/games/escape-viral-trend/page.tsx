'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShareAlt, FaTrophy, FaClock, FaLock, FaUnlock, FaCalendarAlt, FaRedo } from 'react-icons/fa';
import Link from 'next/link';
import Confetti from 'react-confetti';

// Sample viral trend puzzles
const viralTrendPuzzles = [
  {
    id: 1,
    title: "Barbie Movie Mania",
    description: "The internet is obsessed with all things Barbie after the movie release. Solve the puzzle to escape the pink takeover!",
    image: "/images/Escape_the_viral_trend.jpg",
    puzzle: "Unscramble the letters to find the Barbie director's name: EGTARWIGER",
    hint: "She also directed 'Lady Bird' and 'Little Women'",
    answer: "GERWIG",
    difficulty: "medium"
  },
  {
    id: 2,
    title: "AI Art Generator Craze",
    description: "Everyone's turning themselves into anime characters with AI. Crack the code to break free from the algorithm!",
    image: "/images/ai_roast_me.jpg",
    puzzle: "What 4-letter word connects these AI art platforms: Midjourney, DALL-E, and Stable Diffusion?",
    hint: "It's what the AI does to text to create images",
    answer: "TEXT",
    difficulty: "easy"
  },
  {
    id: 3,
    title: "NPC TikTok Streams",
    description: "NPC streamers are taking over TikTok with their repetitive phrases and movements. Solve the puzzle to escape the loop!",
    image: "/images/Who_can_click_the_fatest.jpg",
    puzzle: "Decode this common NPC phrase: 'ICE REAM OOOO SO OOD IVING IFTS'",
    hint: "Add the missing first letters to each word",
    answer: "CREAM SO GOOD GIVING GIFTS",
    difficulty: "hard"
  },
  {
    id: 4,
    title: "Viral Dance Challenge",
    description: "Another dance challenge is sweeping social media. Solve the puzzle before everyone starts doing the same moves!",
    image: "/images/you_laugh_you_lose.jpg",
    puzzle: "What comes next in this viral dance sequence? 👉, 👇, 👈, 👆, 🙌, ?",
    hint: "Think about the most common ending to viral dances",
    answer: "👏",
    difficulty: "medium"
  },
  {
    id: 5,
    title: "BeReal Authenticity",
    description: "BeReal notifications are making everyone drop everything to take 'authentic' photos. Solve the puzzle to break free!",
    image: "/images/placeholder.jpg",
    puzzle: "How many minutes do users have to post after receiving a BeReal notification?",
    hint: "It's a small number that rhymes with 'flu'",
    answer: "2",
    difficulty: "easy"
  }
];

export default function EscapeViralTrendPage() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dailyPuzzles, setDailyPuzzles] = useState<typeof viralTrendPuzzles>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);

  // Initialize daily puzzles
  useEffect(() => {
    // In a real app, this would fetch from an API based on the current date
    // For demo, we'll just shuffle the existing puzzles
    const shuffled = [...viralTrendPuzzles].sort(() => 0.5 - Math.random());
    setDailyPuzzles(shuffled.slice(0, 3)); // Just use 3 puzzles for the daily challenge
  }, []);

  // Handle timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, currentPuzzleIndex]);

  // Start the game
  const startGame = () => {
    setGameState('playing');
    setCurrentPuzzleIndex(0);
    setUserAnswer('');
    setTimeLeft(60);
    setShowHint(false);
    setScore(0);
    setIsCorrect(null);
  };

  // Handle time up
  const handleTimeUp = () => {
    // Move to next puzzle or end game
    if (currentPuzzleIndex < dailyPuzzles.length - 1) {
      setCurrentPuzzleIndex(prev => prev + 1);
      setUserAnswer('');
      setTimeLeft(60);
      setShowHint(false);
      setIsCorrect(null);
    } else {
      endGame();
    }
  };

  // Check answer
  const checkAnswer = () => {
    const currentPuzzle = dailyPuzzles[currentPuzzleIndex];
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === currentPuzzle.answer.toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      // Calculate score based on time left and difficulty
      const difficultyMultiplier = 
        currentPuzzle.difficulty === 'easy' ? 1 :
        currentPuzzle.difficulty === 'medium' ? 1.5 : 2;
      
      const pointsEarned = Math.round((timeLeft * difficultyMultiplier) + (showHint ? 0 : 20));
      setScore(prev => prev + pointsEarned);
      
      // Show success for a moment before moving on
      setTimeout(() => {
        if (currentPuzzleIndex < dailyPuzzles.length - 1) {
          setCurrentPuzzleIndex(prev => prev + 1);
          setUserAnswer('');
          setTimeLeft(60);
          setShowHint(false);
          setIsCorrect(null);
        } else {
          endGame();
        }
      }, 1500);
    }
  };

  // End game
  const endGame = () => {
    setGameState('result');
    setShowConfetti(true);
    
    // Hide confetti after 5 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    // Set free trial as ended if this is their first game
    if (!hasPlayedFreeGame) {
      setHasPlayedFreeGame(true);
      setFreeTrialEnded(true);
      
      // Show account prompt after a short delay
      setTimeout(() => {
        setShowAccountPrompt(true);
      }, 1500);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get current puzzle with fallback
  const getCurrentPuzzle = () => {
    if (dailyPuzzles.length > 0 && dailyPuzzles[currentPuzzleIndex]) {
      return dailyPuzzles[currentPuzzleIndex];
    }
    // Fallback to a default puzzle if the current one isn't available
    return viralTrendPuzzles[4]; // BeReal puzzle as fallback
  };

  // Get current puzzle
  const currentPuzzle = getCurrentPuzzle();

  // Add a function to handle account creation redirect
  const handleCreateAccount = () => {
    // Redirect to the signup page with the game name as a query parameter
    window.location.href = '/signup?from=escape-viral-trend';
  };

  // Add a function to continue without account
  const continueWithoutAccount = () => {
    setShowAccountPrompt(false);
  };

  return (
    <MainLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="container mx-auto px-4 py-12">
        {/* Game header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/games"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Games
          </Link>
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            Escape the Viral Trend
          </h1>
          
          <Link
            href="/leaderboards"
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaTrophy className="mr-2" /> Leaderboard
          </Link>
        </div>
        
        {/* Game content */}
        <div className="max-w-3xl mx-auto">
          {/* Intro screen */}
          {gameState === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Daily Viral Escape Challenge!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Social media trends are taking over! Solve puzzles based on viral internet moments 
                    before time runs out to escape the algorithm.
                  </p>
                  
                  <div className="flex items-center justify-center mb-6">
                    <FaCalendarAlt className="text-blue-500 text-2xl mr-2" />
                    <span className="text-lg font-medium">Today's Challenge: {new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-2">How to Play:</h3>
                    <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                      <li>• Each day features new puzzles based on current viral trends</li>
                      <li>• Solve each puzzle before the 60-second timer runs out</li>
                      <li>• Use hints if you're stuck (but you'll earn fewer points)</li>
                      <li>• Earn points based on speed, difficulty, and hint usage</li>
                      <li>• Share your escape time on social media to challenge friends</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                    >
                      Start Today's Challenge
                    </button>
                  </div>
                  
                  {hasPlayedFreeGame && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-700 dark:text-yellow-400 font-medium">
                        You've played your free game! Create an account to continue playing daily challenges.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>New puzzles available daily at midnight. Come back tomorrow for a fresh challenge!</p>
              </div>
            </motion.div>
          )}
          
          {/* Playing screen */}
          {gameState === 'playing' && currentPuzzle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Progress and timer */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
                <div className="text-sm font-medium">
                  Puzzle {currentPuzzleIndex + 1}/{dailyPuzzles.length}
                </div>
                
                <div className={`flex items-center font-mono text-lg font-bold ${
                  timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  <FaClock className="mr-2" />
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              {/* Puzzle content */}
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{currentPuzzle.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {currentPuzzle.description}
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/40 p-6 rounded-lg border-2 border-blue-300 dark:border-blue-700 mb-4 shadow-sm">
                    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-4 text-center text-xl">PUZZLE:</h3>
                    {currentPuzzle.puzzle ? (
                      <div className="bg-yellow-50 dark:bg-gray-800 p-5 rounded-lg shadow-inner">
                        <p className="font-bold text-xl text-gray-900 dark:text-yellow-200 text-center leading-relaxed">
                          {currentPuzzle.puzzle}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="font-bold text-xl text-red-600 dark:text-red-400">
                          Puzzle content not loading properly
                        </p>
                        <p className="text-base text-gray-700 dark:text-gray-300 mt-2 font-medium">
                          For the BeReal puzzle: How many minutes do users have to post after receiving a BeReal notification?
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {showHint && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                      <p className="text-blue-800 dark:text-blue-300 text-base">
                        <span className="font-bold text-lg">HINT:</span> {currentPuzzle.hint}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Answer input */}
                <div className="mb-6">
                  <label className="block text-gray-800 dark:text-gray-200 mb-3 font-bold text-lg">
                    Your Answer:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className={`flex-1 p-4 border-2 rounded-lg focus:ring-2 focus:outline-none text-lg font-medium ${
                        isCorrect === null 
                          ? 'border-blue-300 dark:border-blue-600 focus:ring-blue-500 bg-blue-50 dark:bg-gray-700 text-gray-800 dark:text-blue-100' 
                          : isCorrect 
                            ? 'border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                            : 'border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      }`}
                    />
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim() || isCorrect === true}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                    >
                      Submit
                    </button>
                  </div>
                  
                  {isCorrect === false && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        That's not correct. Try again!
                      </p>
                    </div>
                  )}
                  
                  {isCorrect === true && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-600 dark:text-green-400 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Correct! Moving to next puzzle...
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Hint and refresh buttons */}
                <div className="flex justify-center space-x-4 mb-4">
                  {!showHint && (
                    <button
                      onClick={() => setShowHint(true)}
                      className="flex items-center justify-center px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800/50 transition-colors border border-yellow-300 dark:border-yellow-700"
                    >
                      <FaLock className="mr-2" /> Reveal Hint (costs points)
                    </button>
                  )}
                  
                  {showHint && (
                    <div className="flex items-center justify-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-300 dark:border-blue-700">
                      <FaUnlock className="mr-2" /> Hint Revealed
                    </div>
                  )}
                  
                  {/* Refresh puzzle button */}
                  <button
                    onClick={() => {
                      // Force refresh the current puzzle
                      const refreshedPuzzle = getCurrentPuzzle();
                      // This will trigger a re-render
                      setUserAnswer('');
                      setIsCorrect(null);
                      // Reset the timer to give the user a fair chance
                      setTimeLeft(60);
                    }}
                    className="flex items-center justify-center px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors border border-green-300 dark:border-green-700"
                  >
                    <FaRedo className="mr-2" /> Refresh Puzzle
                  </button>
                </div>
              </div>
              
              {/* Difficulty indicator and score */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 border-t-2 border-gray-300 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-base font-bold text-gray-700 dark:text-gray-300 mr-2">Difficulty:</span>
                    <span className={`text-base font-bold px-3 py-1 rounded-full ${
                      currentPuzzle.difficulty === 'easy' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700' 
                        : currentPuzzle.difficulty === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700'
                    }`}>
                      {currentPuzzle.difficulty.charAt(0).toUpperCase() + currentPuzzle.difficulty.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-300 dark:border-blue-700">
                    <span className="text-base font-bold text-blue-700 dark:text-blue-300 mr-2">Score:</span>
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{score}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Result screen */}
          {gameState === 'result' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {score > 150 
                    ? "You've Escaped the Algorithm!" 
                    : "Almost Escaped!"}
                </h2>
                
                <div className="mb-8 text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl text-white">
                      {score > 150 ? "🚀" : "⏱️"}
                    </span>
                  </div>
                  
                  <div className="text-5xl font-bold text-blue-500 mb-2">{score}</div>
                  <p className="text-gray-600 dark:text-gray-400">Your Escape Score</p>
                  
                  <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium mb-2">
                      {score > 150 
                        ? "Impressive! You've successfully escaped today's viral trends." 
                        : "You got caught in some trends, but managed to escape others!"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Come back tomorrow for a new daily challenge!
                    </p>
                  </div>
                  
                  {freeTrialEnded && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">
                        You've played your free game!
                      </p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-500">
                        Create an account to continue playing daily challenges and save your scores.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {freeTrialEnded ? (
                    <>
                      <button
                        onClick={handleCreateAccount}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
                      >
                        Create Free Account
                      </button>
                      
                      <button
                        onClick={() => setShowAccountPrompt(true)}
                        className="px-6 py-3 bg-gray-500 text-white font-medium rounded-full hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        Learn More
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          // In a real app, this would integrate with social media APIs
                          alert("Sharing functionality would be integrated with social media platforms!");
                        }}
                        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                      >
                        <FaShareAlt className="mr-2" /> Share Score
                      </button>
                      
                      <button
                        onClick={startGame}
                        className="px-6 py-3 bg-purple-600 text-white font-medium rounded-full hover:bg-purple-700 transition-colors flex items-center justify-center"
                      >
                        Play Again
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Account prompt overlay */}
      {showAccountPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-blue-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You've Completed Your Free Challenge!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create an account to unlock daily challenges, save your scores, and compete on leaderboards.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Account Benefits:</h3>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Access to new daily challenges
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Track your progress over time
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Compete on global leaderboards
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Unlock all games on the platform
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreateAccount}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                Create Free Account
              </button>
              
              <button
                onClick={continueWithoutAccount}
                className="w-full py-3 bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Continue Without Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
} 