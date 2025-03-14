'use client';

import { useState, useRef, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShareAlt, FaTrophy, FaCamera, FaUpload, FaLaugh, FaCrown, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Confetti from 'react-confetti';

// Sample roasts for demo purposes
const sampleRoasts = [
  "Your selfie just made my phone switch to power-saving mode automatically.",
  "I've seen better-looking faces on currency from collapsed civilizations.",
  "You look like you were designed by an AI that was trained exclusively on stock photos of 'disappointed parent'.",
  "That outfit screams 'I let my WiFi password dress me today'.",
  "Your bio reads like it was written by a bot that's trying way too hard to sound human.",
  "Your face has more filters than my coffee maker.",
  "You're so generic, when people forget your name they just call you 'human person'.",
  "Your personality is like elevator music - present, but nobody really notices.",
  "You look like you apologize to furniture when you bump into it.",
  "Your fashion sense is like a 404 error - style not found.",
  "You're not a snack, you're the crumbs at the bottom of the bag that nobody wants.",
  "Your dating profile is probably just 'I like food and traveling' - groundbreaking stuff.",
  "You're about as edgy as a sphere.",
  "You look like you think mayonnaise is spicy.",
  "Your vibe is 'I still use Internet Explorer by choice'."
];

// Sample leaderboard data
const leaderboardData = [
  { name: "RoastMaster3000", score: 98, avatar: "/images/ai_roast_me.jpg" },
  { name: "BurnVictim42", score: 95, avatar: "/images/Escape_the_viral_trend.jpg" },
  { name: "CrispyChicken", score: 92, avatar: "/images/Who_can_click_the_fatest.jpg" },
  { name: "ToastedToast", score: 89, avatar: "/images/you_laugh_you_lose.jpg" },
  { name: "FlameResistant", score: 85, avatar: "/images/placeholder.jpg" },
];

export default function AIRoastMePage() {
  const [gameState, setGameState] = useState<'intro' | 'input' | 'roasting' | 'result'>('intro');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [roasts, setRoasts] = useState<string[]>([]);
  const [currentRoastIndex, setCurrentRoastIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [score, setScore] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);

  // Get image source (either selected image or placeholder)
  const getImageSrc = () => {
    return selectedImage || '/images/placeholder.jpg';
  };

  // Start the game
  const startGame = () => {
    setGameState('input');
    setSelectedImage(null);
    setInputText('');
    setRoasts([]);
    setCurrentRoastIndex(0);
    setScore(0);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Start roasting process
  const startRoasting = () => {
    if (!selectedImage && !inputText.trim()) {
      alert("Please upload a photo or enter some information about yourself!");
      return;
    }
    
    setGameState('roasting');
    
    // Randomly select 5 roasts from the sample
    const shuffled = [...sampleRoasts].sort(() => 0.5 - Math.random());
    const selectedRoasts = shuffled.slice(0, 5);
    setRoasts(selectedRoasts);
    
    // Show first roast after a short delay
    setTimeout(() => {
      setCurrentRoastIndex(0);
    }, 1500);
  };

  // Show next roast
  const showNextRoast = () => {
    if (currentRoastIndex < roasts.length - 1) {
      setCurrentRoastIndex(prev => prev + 1);
    } else {
      // End game after all roasts
      setGameState('result');
      setShowConfetti(true);
      setScore(Math.floor(Math.random() * 50) + 50); // Random score between 50-100
      
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
    }
  };

  // Share roast to social media
  const shareRoast = () => {
    // In a real app, this would integrate with social media APIs
    alert("Sharing functionality would be integrated with social media platforms!");
  };

  // Toggle leaderboard visibility
  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  // Add a function to handle account creation redirect
  const handleCreateAccount = () => {
    // Redirect to the signup page with the game name as a query parameter
    window.location.href = '/signup?from=ai-roast-me';
  };

  // Add a function to continue without account
  const continueWithoutAccount = () => {
    setShowAccountPrompt(false);
  };

  // Add a privacy notice component
  const PrivacyNotice = () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
      <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Privacy Notice:</h3>
      <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
        • Uploaded photos are processed locally in your browser
      </p>
      <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
        • Without an account, photos are not stored on our servers
      </p>
      <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
        • You can use text input instead if you prefer not to upload a photo
      </p>
      <p className="text-sm text-blue-700 dark:text-blue-400">
        • Create an account to save your roasts and optionally store your photos
      </p>
    </div>
  );

  return (
    <MainLayout>
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="container mx-auto px-4 py-12">
        {/* Game header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/games"
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Games
          </Link>
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
            AI Roast Me
          </h1>
          
          <button
            onClick={toggleLeaderboard}
            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
          >
            <FaCrown className="mr-2" /> Roast Kings
          </button>
        </div>
        
        {/* Leaderboard overlay */}
        {showLeaderboard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-red-500">Roast Kings Leaderboard</h2>
                <button 
                  onClick={toggleLeaderboard}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {leaderboardData.map((entry, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="w-8 h-8 flex items-center justify-center font-bold">
                      {index === 0 ? (
                        <FaCrown className="text-yellow-500" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden ml-2">
                      <img 
                        src={entry.avatar} 
                        alt={entry.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-bold">{entry.name}</p>
                    </div>
                    <div className="text-red-500 font-bold">{entry.score}</div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={toggleLeaderboard}
                className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
        
        {/* Game content */}
        <div className="max-w-2xl mx-auto">
          {/* Intro screen */}
          {gameState === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">The Ultimate Roast Challenge!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Think you can handle the heat? Upload your photo or tell us about yourself, 
                    and our AI will roast you in the most hilarious way possible!
                  </p>
                  
                  {/* Add privacy notice */}
                  <PrivacyNotice />
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-2">How to Play:</h3>
                    <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                      <li>• Upload a selfie or enter some information about yourself</li>
                      <li>• Our AI will generate personalized roasts</li>
                      <li>• Rate the roasts and share your favorites</li>
                      <li>• Compete to get the funniest roasts</li>
                      <li>• Top scorers become "Roast Kings" on our leaderboard</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                    >
                      Start Game
                    </button>
                  </div>
                  
                  {hasPlayedFreeGame && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-700 dark:text-yellow-400 font-medium">
                        You've played your free game! Create an account to continue playing and save your roasts.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Note: All roasts are meant to be humorous and not personally offensive.</p>
                <p>By playing, you agree to take everything with a good sense of humor!</p>
              </div>
            </motion.div>
          )}
          
          {/* Input screen */}
          {gameState === 'input' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">What Should We Roast?</h2>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                  <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">About Your Data:</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                    • Without an account, your photo and information are only stored temporarily in your browser
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    • Create an account to save your roasts and optionally store your photos
                  </p>
                </div>
                
                <div className="mb-8">
                  <div 
                    className="w-48 h-48 mx-auto mb-4 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-500 transition-colors overflow-hidden"
                    onClick={triggerFileInput}
                  >
                    {selectedImage ? (
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <FaCamera className="text-4xl text-gray-400 mb-2 mx-auto" />
                        <p className="text-sm text-gray-500">Click to upload a photo</p>
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <div className="text-center">
                    <button
                      onClick={triggerFileInput}
                      className="text-red-500 hover:text-red-600 text-sm flex items-center mx-auto"
                    >
                      <FaUpload className="mr-1" /> {selectedImage ? 'Change Photo' : 'Upload Photo'}
                    </button>
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Or tell us something about yourself:
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="I love pineapple on pizza, I'm a software developer, I've never seen Star Wars..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={startRoasting}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                    disabled={!selectedImage && !inputText.trim()}
                  >
                    Roast Me!
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Roasting screen */}
          {gameState === 'roasting' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center mb-8">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-500">
                    <img 
                      src={getImageSrc()} 
                      alt="Subject" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="ml-6 flex-1">
                    <h3 className="text-xl font-bold mb-1">AI Roast Bot</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Analyzing your {selectedImage ? 'photo' : 'information'}...
                    </p>
                    
                    {currentRoastIndex < roasts.length && (
                      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="italic">{roasts[currentRoastIndex]}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  {currentRoastIndex < roasts.length ? (
                    <button
                      onClick={showNextRoast}
                      className="px-6 py-2 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors"
                    >
                      {currentRoastIndex < roasts.length - 1 ? 'Next Roast' : 'See Results'}
                    </button>
                  ) : (
                    <div className="animate-pulse text-red-500">
                      Calculating your roast score...
                    </div>
                  )}
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Roast Complete!</h2>
                
                <div className="mb-8 text-center">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-red-500 mb-4">
                    <img 
                      src={getImageSrc()} 
                      alt="Subject" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-5xl font-bold text-red-500 mb-2">{score}</div>
                  <p className="text-gray-600 dark:text-gray-400">Your Roast Score</p>
                  
                  <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium mb-2">Best Roast:</p>
                    <p className="italic">{roasts[Math.floor(Math.random() * roasts.length)]}</p>
                  </div>
                  
                  {freeTrialEnded && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">
                        You've played your free game!
                      </p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-500">
                        Create an account to continue playing and save your roasts.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {freeTrialEnded ? (
                    <>
                      <button
                        onClick={handleCreateAccount}
                        className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
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
                        onClick={shareRoast}
                        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                      >
                        <FaShareAlt className="mr-2" /> Share Roast
                      </button>
                      
                      <button
                        onClick={startGame}
                        className="px-6 py-3 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        <FaLaugh className="mr-2" /> Try Again
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCrown className="text-red-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You've Completed Your Free Roast!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create an account to unlock unlimited roasts, save your scores, and compete on leaderboards.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Account Benefits:</h3>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Unlimited access to all games
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Save your roasts and high scores
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Compete on the Roast Kings leaderboard
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Challenge friends and share results
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreateAccount}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
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