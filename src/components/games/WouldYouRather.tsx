'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRedo, FaSpinner } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { categories } from '@/utils/categories';

interface Question {
  question: string;
  optionA: {
    text: string;
    consequence: string;
  };
  optionB: {
    text: string;
    consequence: string;
  };
  funFact: string;
}

interface PersonalityAnalysis {
  title: string;
  description: string;
  traits: string[];
  icon: string;
}

type Category = 'funny' | 'adventure' | 'superpowers' | 'life-decisions' | 'time-travel' | 'food' | 'career' | 'technology' | 'random';

interface WouldYouRatherProps {
  isEmbedded?: boolean;
}

export default function WouldYouRather({ isEmbedded = false }: WouldYouRatherProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(0 | 1 | null)[]>(new Array(5).fill(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [personalityAnalysis, setPersonalityAnalysis] = useState<PersonalityAnalysis | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('funny');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchNewQuestion = React.useCallback(async () => {
    try {
      setGenerating(true);
      const response = await fetch('/api/would-you-rather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: selectedCategory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch question');
      }

      const data = await response.json();
      
      // Validate the response data
      if (!data.question || !data.optionA || !data.optionB) {
        throw new Error('Invalid question data received');
      }

      setQuestions(prev => {
        const newQuestions = [...prev];
        newQuestions[currentQuestionIndex] = data;
        return newQuestions;
      });
    } catch (error) {
      console.error('Error fetching question:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch question');
      // Don't restart the game immediately, let the user see the error
    } finally {
      setGenerating(false);
    }
  }, [currentQuestionIndex, selectedCategory]);

  const restartGame = React.useCallback(() => {
    console.log('Restarting game...');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(5).fill(null));
    setShowResults(false);
    setShowConfetti(false);
    setLoading(true);
    setError(null);
    fetchNewQuestion();
  }, [fetchNewQuestion]);

  const analyzePersonality = React.useCallback((questions: Question[], answers: (0 | 1 | null)[]) => {
    // Count different types of choices
    let adventurousChoices = 0;
    let cautiousChoices = 0;
    let selflessChoices = 0;
    let selfishChoices = 0;

    questions.forEach((question, index) => {
      const answer = answers[index];
      if (answer === null) return;

      // Analyze based on consequences
      const chosenOption = answer === 0 ? question.optionA : question.optionB;
      const consequence = chosenOption.consequence.toLowerCase();

      if (consequence.includes('adventure') || consequence.includes('risk')) {
        adventurousChoices++;
      }
      if (consequence.includes('safe') || consequence.includes('secure')) {
        cautiousChoices++;
      }
      if (consequence.includes('help') || consequence.includes('others')) {
        selflessChoices++;
      }
      if (consequence.includes('benefit') || consequence.includes('gain')) {
        selfishChoices++;
      }
    });

    // Determine personality type
    let analysis: PersonalityAnalysis;
    if (adventurousChoices > cautiousChoices) {
      if (selflessChoices > selfishChoices) {
        analysis = {
          title: "The Noble Adventurer",
          description: "You're a courageous soul who values both excitement and helping others. Your choices show a willingness to take risks for the greater good.",
          traits: ["Brave", "Altruistic", "Spontaneous", "Empathetic"],
          icon: "🌟"
        };
      } else {
        analysis = {
          title: "The Thrill Seeker",
          description: "You live life on the edge and aren't afraid to chase your own happiness. Your choices prioritize excitement and personal gain.",
          traits: ["Bold", "Independent", "Ambitious", "Free-spirited"],
          icon: "⚡"
        };
      }
    } else {
      if (selflessChoices > selfishChoices) {
        analysis = {
          title: "The Wise Guardian",
          description: "You're a thoughtful person who values stability and helping others. Your choices show careful consideration and concern for others.",
          traits: ["Cautious", "Caring", "Reliable", "Thoughtful"],
          icon: "🛡️"
        };
      } else {
        analysis = {
          title: "The Strategic Thinker",
          description: "You're a careful planner who values security and personal success. Your choices show a preference for safe, calculated decisions.",
          traits: ["Prudent", "Focused", "Determined", "Practical"],
          icon: "🎯"
        };
      }
    }

    return analysis;
  }, []);

  const handleAnswer = React.useCallback(async (answer: 0 | 1) => {
    if (isProcessing || currentQuestionIndex >= 5) return;

    try {
      setIsProcessing(true);
      setSelectedAnswers(prev => {
        const newAnswers = [...prev];
        newAnswers[currentQuestionIndex] = answer;
        return newAnswers;
      });

      // Wait for 3 seconds before moving to next question
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (currentQuestionIndex < 4) {
        setCurrentQuestionIndex(prev => prev + 1);
        // Fetch next question immediately
        await fetchNewQuestion();
      } else {
        // On the last question, analyze personality and show results
        const analysis = analyzePersonality(questions, selectedAnswers);
        setPersonalityAnalysis(analysis);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
      // If there's an error, try to recover by restarting the game
      restartGame();
    } finally {
      setIsProcessing(false);
    }
  }, [currentQuestionIndex, isProcessing, questions, fetchNewQuestion]);

  const handleTouchStart = React.useCallback((e: React.TouchEvent, answerIndex: 0 | 1) => {
    // Remove preventDefault and handle the touch event directly
    handleAnswer(answerIndex as 0 | 1);
  }, [handleAnswer]);

  // Add effect to handle initial game setup
  useEffect(() => {
    const initGame = async () => {
      try {
        setLoading(true);
        setError(null);
        setSelectedAnswers(new Array(5).fill(null));
        await fetchNewQuestion();
      } catch (error) {
        console.error('Error initializing game:', error);
        setError('Failed to start game. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    initGame();
  }, [fetchNewQuestion]);

  // Add a recovery effect
  React.useEffect(() => {
    const validateGameState = () => {
      if (currentQuestionIndex >= 5 && !showResults) {
        console.warn('Invalid game state detected, restarting game');
        restartGame();
      }
    };

    validateGameState();
  }, [currentQuestionIndex, showResults]);

  // Improve question fetching effect
  React.useEffect(() => {
    if (!isEmbedded && !showResults && currentQuestionIndex < 5) {
      const fetchQuestions = async () => {
        try {
          for (let i = 0; i < 5; i++) {
            await fetchNewQuestion();
          }
        } catch (error) {
          console.error('Error fetching initial questions:', error);
          restartGame();
        }
      };

      fetchQuestions();
    }
  }, [isEmbedded, showResults, fetchNewQuestion]);

  // Remove redundant effects and keep only the essential ones
  const currentQuestion = questions[currentQuestionIndex];

  if (loading && !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={restartGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col ${!isEmbedded ? 'min-h-screen' : 'min-h-[600px]'} bg-gray-900`}>
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 500}
          height={typeof window !== 'undefined' ? window.innerHeight : 500}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Category Selector */}
              <div className="mb-8">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as Category)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                  disabled={generating}
                >
                  <option value="random">Random</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-gray-400 mb-2">
                  <span>Question {currentQuestionIndex + 1}/5</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / 5) * 100)}%</span>
              </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                  />
              </div>
            </div>
            
              {/* Question */}
              <div className="bg-gray-800 rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">
                  {currentQuestion.question}
                </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[currentQuestion.optionA, currentQuestion.optionB].map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === index;
                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index as 0 | 1)}
                        onTouchStart={(e) => handleTouchStart(e, index as 0 | 1)}
                        disabled={selectedAnswers[currentQuestionIndex] !== null}
                        className={`p-6 rounded-xl text-white text-lg font-semibold transition-all transform active:scale-95 ${
                          isSelected
                            ? 'bg-blue-600'
                            : selectedAnswers[currentQuestionIndex] !== null
                            ? 'bg-gray-700 opacity-50'
                            : 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                        }`}
                        style={{ 
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'none'
                        }}
                      >
                        <div className="pointer-events-none">
                          {option.text}
                          {isSelected && (
              <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 text-sm font-normal text-blue-200"
                            >
                              {option.consequence}
                            </motion.div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              
                {selectedAnswers[currentQuestionIndex] !== null && (
              <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-gray-400 text-center"
                  >
                    <p className="font-semibold text-blue-400">Fun Fact:</p>
                    <p>{currentQuestion.funFact}</p>
                  </motion.div>
                  )}
                </div>
              </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center px-4 flex flex-col min-h-[calc(100vh-4rem)]"
            >
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-8">Game Complete!</h2>
                
                {/* Personality Analysis */}
                {personalityAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
                  >
                    <div className="text-4xl mb-4">{personalityAnalysis.icon}</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{personalityAnalysis.title}</h3>
                    <p className="text-gray-300 mb-4 text-sm sm:text-base">{personalityAnalysis.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {personalityAnalysis.traits.map((trait, index) => (
                        <span
                          key={index}
                          className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Choices Summary */}
                <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 overflow-y-auto max-h-[50vh]">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Your Choices:</h3>
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <div key={index} className="text-left bg-gray-700 rounded-lg p-3 sm:p-4">
                        <p className="text-gray-300 mb-2 text-sm sm:text-base">{question.question}</p>
                        <p className="text-blue-400 font-medium text-sm sm:text-base">
                          You chose: {selectedAnswers[index] === 0 ? question.optionA.text : question.optionB.text}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                          {selectedAnswers[index] === 0 ? question.optionA.consequence : question.optionB.consequence}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
            </div>
            
              <div className="sticky bottom-0 left-0 right-0 bg-gray-900 py-4 mt-4">
                <button
                  onClick={restartGame}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-500 text-white rounded-xl font-bold text-lg sm:text-xl transition-all transform hover:scale-105 hover:bg-blue-600 flex items-center justify-center mx-auto"
                >
                  <FaRedo className="mr-2" /> Play Again
                </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
} 