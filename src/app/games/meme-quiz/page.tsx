'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShareAlt, FaTrophy } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Confetti from 'react-confetti';

// Sample meme quiz data
const memeQuizData = [
  {
    id: 1,
    memeImage: '/images/placeholder.jpg',
    question: 'What is the name of this meme?',
    options: [
      'Distracted Boyfriend',
      'Hide the Pain Harold',
      'Disaster Girl',
      'Success Kid'
    ],
    correctAnswer: 'Distracted Boyfriend',
  },
  {
    id: 2,
    memeImage: '/images/placeholder.jpg',
    question: 'What year did this meme first go viral?',
    options: ['2010', '2013', '2016', '2019'],
    correctAnswer: '2016',
  },
  {
    id: 3,
    memeImage: '/images/placeholder.jpg',
    question: 'Which character is this meme based on?',
    options: [
      'Kermit the Frog',
      'Pepe the Frog',
      'Michigan J. Frog',
      'Crazy Frog'
    ],
    correctAnswer: 'Kermit the Frog',
  },
  {
    id: 4,
    memeImage: '/images/placeholder.jpg',
    question: 'What is this meme commonly used to express?',
    options: [
      'Confusion',
      'Surprise',
      'Disappointment',
      'Skepticism'
    ],
    correctAnswer: 'Skepticism',
  },
  {
    id: 5,
    memeImage: '/images/placeholder.jpg',
    question: 'Which social media platform did this meme originate from?',
    options: ['Twitter', 'Reddit', 'TikTok', 'Instagram'],
    correctAnswer: 'Twitter',
  },
];

export default function MemeQuizPage() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQuestion = memeQuizData[currentQuestionIndex];

  // Handle timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, currentQuestionIndex]);

  // Start the game
  const startGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(15);
  };

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 100);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  // Move to next question or end game
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < memeQuizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(15);
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
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Games
          </Link>
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Meme Quiz
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
                <h2 className="text-2xl font-bold mb-4">Test Your Meme Knowledge!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  How well do you know your internet memes? Answer questions about popular memes and see if you're truly a meme expert!
                </p>
                
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <h3 className="font-bold mb-2">How to Play:</h3>
                  <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• You'll be shown a series of meme images with questions</li>
                    <li>• Select the correct answer from the options</li>
                    <li>• You have 15 seconds to answer each question</li>
                    <li>• Earn 100 points for each correct answer</li>
                    <li>• See how your score compares on the leaderboard</li>
                  </ul>
                </div>
                
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Playing screen */}
        {gameState === 'playing' && currentQuestion && (
          <div className="max-w-3xl mx-auto">
            {/* Progress and timer */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">
                Question {currentQuestionIndex + 1}/{memeQuizData.length}
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
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / memeQuizData.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
              {/* Meme image */}
              <div className="relative aspect-video w-full">
                <Image
                  src={currentQuestion.memeImage}
                  alt="Meme"
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Question */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>
                
                {/* Answer options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`p-4 rounded-lg text-left transition-colors ${
                        selectedAnswer
                          ? option === currentQuestion.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300'
                            : option === selectedAnswer
                            ? 'bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300'
                            : 'bg-gray-100 dark:bg-gray-700 opacity-50'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      } border ${
                        selectedAnswer && option === currentQuestion.correctAnswer
                          ? 'border-green-500'
                          : selectedAnswer && option === selectedAnswer
                          ? 'border-red-500'
                          : 'border-transparent'
                      }`}
                      disabled={!!selectedAnswer}
                    >
                      {option}
                    </button>
                  ))}
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
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You scored {score} out of {memeQuizData.length * 100} points
                </p>
                
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl mb-8">
                  <div className="text-5xl font-bold mb-2">{score}</div>
                  <div className="text-white/80">Your Score</div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={startGame}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                  >
                    Play Again
                  </button>
                  
                  <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-full border border-blue-200 hover:bg-blue-50 transition-colors flex items-center justify-center">
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