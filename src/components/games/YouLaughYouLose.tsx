'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaRedo, FaCamera, FaShareAlt, FaTrophy, FaUserPlus } from 'react-icons/fa';
import Confetti from 'react-confetti';
import Image from 'next/image';

// Sample jokes for the game
const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "What do you call a fake noodle? An impasta!",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I'm reading a book about anti-gravity. It's impossible to put down!",
  "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
  "Why don't eggs tell jokes? They'd crack each other up.",
  "I used to be a baker, but I couldn't make enough dough.",
  "Parallel lines have so much in common. It's a shame they'll never meet.",
  "What's the best thing about Switzerland? I don't know, but the flag is a big plus."
];

// Sample memes for the game
const memes = [
  "/images/meme1.jpg",
  "/images/meme2.jpg",
  "/images/meme3.jpg",
  "/images/meme4.jpg",
  "/images/meme5.jpg"
];

interface YouLaughYouLoseProps {
  isEmbedded?: boolean;
}

export default function YouLaughYouLose({ isEmbedded = false }: YouLaughYouLoseProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentJoke, setCurrentJoke] = useState('');
  const [currentMeme, setCurrentMeme] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [smileDetected, setSmileDetected] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const jokeTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start the game
  const startGame = () => {
    // If free trial ended and not embedded, show account prompt
    if (freeTrialEnded && !isEmbedded) {
      setShowAccountPrompt(true);
      return;
    }
    
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setSmileDetected(false);
    
    // Start with a random joke
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    setCurrentJoke(randomJoke);
    
    // Start with a random meme
    const randomMeme = memes[Math.floor(Math.random() * memes.length)];
    setCurrentMeme(randomMeme);
    
    // Start the camera if available
    startCamera();
    
    // Start the game timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Change joke/meme every 5 seconds
    jokeTimerRef.current = setInterval(() => {
      // 50% chance to show a joke or a meme
      if (Math.random() > 0.5) {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        setCurrentJoke(randomJoke);
        setCurrentMeme('');
      } else {
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        setCurrentMeme(randomMeme);
        setCurrentJoke('');
      }
    }, 5000);
  };
  
  // Start the camera
  const startCamera = async () => {
    try {
      setCameraActive(true);
      
      // In a real app, this would use face detection API
      // For this demo, we'll simulate smile detection
      const simulateSmileDetection = () => {
        // 10% chance to detect a smile every 2 seconds
        if (Math.random() < 0.1 && !smileDetected) {
          handleSmileDetected();
        }
      };
      
      // Check for smiles every 2 seconds
      const smileDetectionInterval = setInterval(simulateSmileDetection, 2000);
      
      // Clean up
      return () => clearInterval(smileDetectionInterval);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraActive(false);
    }
  };
  
  // Handle when a smile is detected
  const handleSmileDetected = () => {
    if (gameState !== 'playing') return;
    
    setSmileDetected(true);
    endGame();
  };
  
  // End the game
  const endGame = () => {
    setGameState('result');
    
    // Calculate score based on time survived
    const finalScore = timeLeft;
    setScore(finalScore);
    
    // Show confetti if they did well (survived more than 15 seconds)
    if (finalScore > 15) {
      setShowConfetti(true);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
    
    // Clean up timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (jokeTimerRef.current) {
      clearInterval(jokeTimerRef.current);
    }
    
    // Stop camera
    setCameraActive(false);
    
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
  
  // Share score to social media
  const shareScore = () => {
    // In a real app, this would integrate with social media APIs
    alert(`Sharing score: You survived ${score} seconds without laughing!`);
  };

  // Add a function to handle account creation redirect
  const handleCreateAccount = () => {
    // Redirect to the signup page with the game name as a query parameter
    window.location.href = '/signup?from=you-laugh-you-lose';
  };

  // Add a function to continue without account
  const continueWithoutAccount = () => {
    setShowAccountPrompt(false);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (jokeTimerRef.current) clearInterval(jokeTimerRef.current);
    };
  }, []);
  
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
            <h1 className="text-3xl font-bold mb-6">You Laugh, You Lose!</h1>
            <p className="text-lg mb-8">
              Try not to laugh at our jokes and memes. If you smile or laugh, you lose!
            </p>
            
            <button
              onClick={startGame}
              className="py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors mx-auto mb-8 flex items-center"
            >
              <FaPlay className="mr-2" /> Start Game
            </button>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-w-lg mx-auto">
              <h2 className="font-bold text-lg mb-2">How to Play:</h2>
              <ul className="text-left list-disc pl-5 space-y-1">
                <li>We'll show you jokes and memes</li>
                <li>Try not to laugh or smile</li>
                <li>Your camera will detect if you laugh</li>
                <li>The longer you last, the higher your score</li>
                <li>You have 30 seconds to survive</li>
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
        
        {gameState === 'playing' && (
          <div className="flex flex-col md:flex-row h-full gap-6">
            {/* Camera feed */}
            <div className="flex-1 bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <div className="text-white text-center p-4">
                  <FaCamera className="text-4xl mx-auto mb-2" />
                  <p>Camera not available</p>
                </div>
              )}
              
              {/* Timer overlay */}
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                Time: {timeLeft}s
              </div>
            </div>
            
            {/* Joke/Meme display */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-6 flex items-center justify-center">
              {currentJoke && (
                <motion.div
                  key={currentJoke}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-xl font-medium">{currentJoke}</p>
                </motion.div>
              )}
              
              {currentMeme && (
                <motion.div
                  key={currentMeme}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="relative w-full max-w-md h-64 mx-auto">
                    <Image
                      src={currentMeme}
                      alt="Funny meme"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
        
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-2">
              {smileDetected ? "You Laughed!" : "Time's Up!"}
            </h2>
            <p className="text-lg mb-6">
              {smileDetected 
                ? `We caught you laughing! You survived ${score} seconds.`
                : `Impressive! You survived the full ${score} seconds without laughing!`
              }
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={startGame}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FaRedo className="inline mr-1" /> Play Again
              </button>
              <button
                onClick={shareScore}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FaShareAlt className="inline mr-1" /> Share Score
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
                <FaTrophy className="text-yellow-500 mr-2" /> Leaderboard
              </h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="py-2 px-4 text-left">Rank</th>
                      <th className="py-2 px-4 text-left">Player</th>
                      <th className="py-2 px-4 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                      <td className="py-3 px-4">
                        <span className="text-yellow-500">🥇</span>
                      </td>
                      <td className="py-3 px-4">StoicFace 🇺🇸</td>
                      <td className="py-3 px-4 text-right font-bold">30s</td>
                    </tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                      <td className="py-3 px-4">
                        <span className="text-gray-400">🥈</span>
                      </td>
                      <td className="py-3 px-4">NoLaughGal 🇬🇧</td>
                      <td className="py-3 px-4 text-right font-bold">30s</td>
                    </tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-yellow-50 dark:bg-yellow-900/20">
                      <td className="py-3 px-4">
                        <span className="text-amber-600">🥉</span>
                      </td>
                      <td className="py-3 px-4">DeadpanKing 🇯🇵</td>
                      <td className="py-3 px-4 text-right font-bold">28s</td>
                    </tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">#4</td>
                      <td className="py-3 px-4">SeriousSam 🇨🇦</td>
                      <td className="py-3 px-4 text-right font-bold">25s</td>
                    </tr>
                    <tr className="border-t border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">#5</td>
                      <td className="py-3 px-4">PokerFace 🇦🇺</td>
                      <td className="py-3 px-4 text-right font-bold">22s</td>
                    </tr>
                    
                    {/* Your score */}
                    <tr className="border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                      <td className="py-3 px-4">You</td>
                      <td className="py-3 px-4">You</td>
                      <td className="py-3 px-4 text-right font-bold">{score}s</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 