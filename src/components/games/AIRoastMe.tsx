'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaRedo, FaShareAlt, FaFire, FaUserPlus } from 'react-icons/fa';
import Confetti from 'react-confetti';
import Image from 'next/image';

// Sample roasts for the game
const sampleRoasts = [
  "Your selfie just made my phone switch to power saving mode to avoid looking at it.",
  "You look like you were drawn by an artist who only had a vague description of what humans look like.",
  "If 'minimum effort' was a person, it would be offended by the comparison to you.",
  "You're not ugly, you're just suffering from a terminal case of unflattering camera angles... for the past decade.",
  "Your fashion sense is like a weather forecast - wildly unpredictable and usually disappointing.",
  "I've seen more life in a mannequin display at a closing-down sale.",
  "Your selfie has the same energy as a LinkedIn profile picture taken in a car with sunglasses on.",
  "You look like you ask the barber to make you look like you cut your own hair.",
  "Your expression screams 'I peaked in middle school and I'm still not over it.'",
  "If 'plain yogurt' was a person, it would ask you to spice things up a bit."
];

interface AIRoastMeProps {
  isEmbedded?: boolean;
}

export default function AIRoastMe({ isEmbedded = false }: AIRoastMeProps) {
  const [gameState, setGameState] = useState<'intro' | 'camera' | 'processing' | 'result'>('intro');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [roast, setRoast] = useState<string>('');
  const [roastLevel, setRoastLevel] = useState<'mild' | 'medium' | 'savage'>('medium');
  const [showConfetti, setShowConfetti] = useState(false);
  const [reactionScore, setReactionScore] = useState(0);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Start camera capture
  const startCamera = async () => {
    // If free trial ended and not embedded, show account prompt
    if (freeTrialEnded && !isEmbedded) {
      setShowAccountPrompt(true);
      return;
    }
    
    setGameState('camera');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      // Fallback to file upload if camera access fails
      handleFileUpload();
    }
  };
  
  // Take a photo from the camera
  const takePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    
    setSelectedImage(dataUrl);
    stopCamera();
    processImage();
  };
  
  // Stop the camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    // If free trial ended and not embedded, show account prompt
    if (freeTrialEnded && !isEmbedded) {
      setShowAccountPrompt(true);
      return;
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Process the selected file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
        processImage();
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Process the image and generate a roast
  const processImage = () => {
    setGameState('processing');
    
    // Simulate AI processing time
    setTimeout(() => {
      // In a real app, this would call an AI API
      // For this demo, we'll use sample roasts
      const randomRoast = sampleRoasts[Math.floor(Math.random() * sampleRoasts.length)];
      
      // Add roast level modifiers
      let finalRoast = randomRoast;
      if (roastLevel === 'mild') {
        finalRoast = `I mean... ${randomRoast} But you're still cool though!`;
      } else if (roastLevel === 'savage') {
        finalRoast = `BRUTAL TRUTH: ${randomRoast} And that's not even your worst feature!`;
      }
      
      setRoast(finalRoast);
      
      // Generate a random reaction score
      const score = Math.floor(Math.random() * 100) + 1;
      setReactionScore(score);
      
      // Show confetti for high scores
      if (score > 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      
      setGameState('result');
      
      // Set free trial as ended if this is their first game and not embedded
      if (!hasPlayedFreeGame && !isEmbedded) {
        setHasPlayedFreeGame(true);
        setFreeTrialEnded(true);
        
        // Show account prompt after a short delay
        setTimeout(() => {
          setShowAccountPrompt(true);
        }, 1500);
      }
    }, 2000);
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState('intro');
    setSelectedImage(null);
    setRoast('');
    setShowConfetti(false);
  };
  
  // Share roast to social media
  const shareRoast = () => {
    // In a real app, this would integrate with social media APIs
    alert(`Sharing roast: "${roast}"`);
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
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
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
            <h1 className="text-3xl font-bold mb-6">AI Roast Me</h1>
            <p className="text-lg mb-8">
              Upload a selfie and our AI will roast you! How savage can you handle?
            </p>
            
            <div className="mb-8">
              <h2 className="font-bold text-lg mb-4">Select Roast Level:</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setRoastLevel('mild')}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                    roastLevel === 'mild' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Mild
                </button>
                <button
                  onClick={() => setRoastLevel('medium')}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                    roastLevel === 'medium' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setRoastLevel('savage')}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                    roastLevel === 'savage' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Savage
                </button>
              </div>
              </div>
              
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
              <button
                onClick={startCamera}
                className="py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center"
              >
                <FaCamera className="mr-2" /> Take Selfie
              </button>
              <button
                onClick={handleFileUpload}
                className="py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-lg transition-colors"
              >
                Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg max-w-lg mx-auto">
              <h2 className="font-bold text-lg mb-2">How it Works:</h2>
              <ul className="text-left list-disc pl-5 space-y-1">
                <li>Take a selfie or upload a photo</li>
                <li>Our AI analyzes your image</li>
                <li>Get a personalized roast based on your photo</li>
                <li>Share the roast with friends</li>
                <li>All in good fun - don't take it personally!</li>
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
        
        {gameState === 'camera' && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Take Your Selfie</h2>
            
            <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg mb-6 overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={takePhoto}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                Take Photo
              </button>
              <button
                onClick={() => {
                  stopCamera();
                  setGameState('intro');
                }}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {gameState === 'processing' && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative w-64 h-64 mb-6">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Your photo"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">AI is analyzing your photo...</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Our advanced AI is crafting the perfect roast just for you!
            </p>
          </div>
        )}
        
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Your AI Roast</h2>
            
            <div className="flex flex-col md:flex-row gap-6 mb-8 max-w-4xl mx-auto">
              <div className="flex-1">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  {selectedImage && (
                    <Image
                      src={selectedImage}
                      alt="Your photo"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-4 relative">
                  <div className="absolute -top-3 -left-3">
                    <FaFire className="text-3xl text-red-500" />
                  </div>
                  <p className="text-xl italic">{roast}</p>
              </div>
              
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Reaction Score</h3>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 h-6 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-red-500 flex items-center justify-end px-2 text-xs text-white font-bold"
                      style={{ width: `${reactionScore}%` }}
                    >
                      {reactionScore}%
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {reactionScore < 30 && "Meh, we've seen better reactions."}
                    {reactionScore >= 30 && reactionScore < 70 && "Pretty good roast! People are laughing."}
                    {reactionScore >= 70 && "Epic roast! This one's going viral!"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FaRedo className="inline mr-1" /> Try Again
              </button>
              <button
                onClick={shareRoast}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <FaShareAlt className="inline mr-1" /> Share Roast
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
          </motion.div>
        )}
      </div>
    </div>
  );
} 