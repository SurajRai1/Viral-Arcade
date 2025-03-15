'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaRedo, FaCamera, FaShareAlt, FaTrophy, FaUserPlus, FaMicrophone, FaFacebook, FaTwitter, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import Confetti from 'react-confetti';
import Image from 'next/image';
import * as faceapi from 'face-api.js';
import { loadFaceDetectionModels, detectSmile } from '@/utils/faceDetection';
import { fetchJoke, fetchRoast, getRandomContent } from '@/utils/contentFetcher';

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
  "/images/you_laugh_you_lose.jpg",
  "/images/ai_roast_me.jpg",
  "/images/Escape_the_viral_trend.jpg",
  "/images/Who_can_click_the_fatest.jpg",
  "/images/placeholder.jpg"
];

interface YouLaughYouLoseProps {
  isEmbedded?: boolean;
}

export default function YouLaughYouLose({ isEmbedded = false }: YouLaughYouLoseProps) {
  const [gameState, setGameState] = useState<'intro' | 'permissions' | 'playing' | 'result'>('intro');
  const [currentJoke, setCurrentJoke] = useState('');
  const [currentMeme, setCurrentMeme] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [smileDetected, setSmileDetected] = useState(false);
  const [laughDetected, setLaughDetected] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioAnalyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const jokeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioDetectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load face-api models
  const loadModels = async () => {
    try {
      setLoadingModels(true);
      
      // Use our improved face detection loader
      const success = await loadFaceDetectionModels();
      
      setModelsLoaded(success);
      setLoadingModels(false);
      
      if (!success) {
        console.warn("Face detection models couldn't be loaded. Using fallback detection.");
      }
    } catch (error) {
      console.error("Error loading face detection models:", error);
      setModelsLoaded(false);
      setLoadingModels(false);
    }
  };
  
  // Request permissions and start game
  const requestPermissions = async () => {
    setGameState('permissions');
    
    try {
      // Load face detection models
      if (!modelsLoaded && !loadingModels) {
        await loadModels();
      }
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support camera access. Try using a modern browser like Chrome, Firefox, or Edge.");
      }
      
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: true 
      });
      
      // Set up video stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Set up audio analysis
      setupAudioAnalysis(stream);
      
      setCameraActive(true);
      setMicrophoneActive(true);
      setPermissionsGranted(true);
      setPermissionDenied(false);
      
      // Start the game after permissions are granted
      startGame();
      
    } catch (error) {
      console.error("Error accessing camera or microphone:", error);
      setCameraActive(false);
      setMicrophoneActive(false);
      setPermissionDenied(true);
      
      // Show specific error message
      if (error instanceof Error) {
        alert(`Camera/microphone access error: ${error.message}`);
      }
    }
  };
  
  // Set up audio analysis for laugh detection
  const setupAudioAnalysis = (stream: MediaStream) => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      audioAnalyserRef.current = audioContextRef.current.createAnalyser();
      audioAnalyserRef.current.fftSize = 256;
      
      source.connect(audioAnalyserRef.current);
      
      // Start audio level detection
      audioDetectionIntervalRef.current = setInterval(() => {
        if (audioAnalyserRef.current && gameState === 'playing') {
          const dataArray = new Uint8Array(audioAnalyserRef.current.frequencyBinCount);
          audioAnalyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          
          // If volume is above threshold, might be laughing
          if (average > 70) { // Adjust threshold as needed
            handleLaughDetected();
          }
        }
      }, 500);
      
    } catch (error) {
      console.error("Error setting up audio analysis:", error);
    }
  };
  
  // Start the game
  const startGame = () => {
    if (!permissionsGranted) {
      requestPermissions();
      return;
    }
    
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    setSmileDetected(false);
    setLaughDetected(false);
    setShowConfetti(false);
    
    // Start face detection
    startFaceDetection();
    
    // Show random jokes and memes
    showRandomContent();
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Show random jokes and memes
  const showRandomContent = async () => {
    try {
      // Start with a joke from OpenAI
      const joke = await fetchJoke();
      setCurrentJoke(joke);
      setCurrentMeme('');
      
      // Alternate between jokes, roasts, and memes
      jokeTimerRef.current = setInterval(async () => {
        try {
          if (currentJoke) {
            // Show a meme
            setCurrentMeme(memes[Math.floor(Math.random() * memes.length)]);
            setCurrentJoke('');
          } else {
            // Get random content (joke or roast)
            const content = await getRandomContent();
            if (content.type === 'memeText') {
              // Show a meme with the generated text
              setCurrentMeme(memes[Math.floor(Math.random() * memes.length)]);
              setCurrentJoke(content.content); // Show the meme text as a caption
            } else {
              // Show a joke or roast
              setCurrentJoke(content.content);
              setCurrentMeme('');
            }
          }
        } catch (error) {
          console.error("Error fetching content:", error);
          // Fallback to static jokes if API fails
          setCurrentJoke(jokes[Math.floor(Math.random() * jokes.length)]);
          setCurrentMeme('');
        }
      }, 5000);
    } catch (error) {
      console.error("Error in initial content fetch:", error);
      // Fallback to static jokes if API fails
      setCurrentJoke(jokes[Math.floor(Math.random() * jokes.length)]);
    }
  };
  
  // Start face detection
  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set up canvas
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // If models loaded successfully, use face-api.js
    if (modelsLoaded) {
      // Start detection interval
      detectionIntervalRef.current = setInterval(async () => {
        if (video.readyState === 4 && gameState === 'playing') {
          try {
            // Use our utility function to detect smiles
            const isSmiling = await detectSmile(video);
            if (isSmiling) {
              handleSmileDetected();
            }
          } catch (error) {
            console.error("Error during face detection:", error);
            // Fall back to random detection if face-api fails
            if (Math.random() < 0.05) {
              handleSmileDetected();
            }
          }
        }
      }, 500);
    } else {
      // Fallback: simulate smile detection randomly
      detectionIntervalRef.current = setInterval(() => {
        if (gameState === 'playing' && Math.random() < 0.05) {
          handleSmileDetected();
        }
      }, 1000);
    }
  };
  
  // Handle when a smile is detected
  const handleSmileDetected = useCallback(() => {
    if (gameState === 'playing' && !smileDetected) {
      setSmileDetected(true);
      endGame();
    }
  }, [gameState, smileDetected]);
  
  // Handle when a laugh is detected
  const handleLaughDetected = useCallback(() => {
    if (gameState === 'playing' && !laughDetected) {
      setLaughDetected(true);
      endGame();
    }
  }, [gameState, laughDetected]);
  
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
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    if (audioDetectionIntervalRef.current) {
      clearInterval(audioDetectionIntervalRef.current);
    }
    
    // Stop camera and microphone
    stopMediaDevices();
    
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
  
  // Stop camera and microphone
  const stopMediaDevices = () => {
    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Stop audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setCameraActive(false);
    setMicrophoneActive(false);
  };
  
  // Share score
  const shareScore = () => {
    const text = `I survived ${score} seconds in the "You Laugh You Lose" challenge! Can you beat my score?`;
    const url = window.location.href;
    
    // Open share dialog
    if (navigator.share) {
      navigator.share({
        title: 'My Score in You Laugh You Lose',
        text: text,
        url: url,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const socialLinks = [
        { name: 'Facebook', icon: <FaFacebook />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}` },
        { name: 'Twitter', icon: <FaTwitter />, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
        { name: 'WhatsApp', icon: <FaWhatsapp />, url: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}` },
        { name: 'Email', icon: <FaEnvelope />, url: `mailto:?subject=My Score in You Laugh You Lose&body=${encodeURIComponent(text + '\n\n' + url)}` },
      ];
      
      // Create a modal with social sharing options
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100%';
      modal.style.height = '100%';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '9999';
      
      const content = document.createElement('div');
      content.style.backgroundColor = 'white';
      content.style.borderRadius = '8px';
      content.style.padding = '20px';
      content.style.maxWidth = '90%';
      content.style.width = '400px';
      
      const title = document.createElement('h3');
      title.textContent = 'Share Your Score';
      title.style.marginBottom = '15px';
      title.style.fontSize = '18px';
      title.style.fontWeight = 'bold';
      
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.marginTop = '15px';
      closeButton.style.padding = '8px 16px';
      closeButton.style.backgroundColor = '#e2e8f0';
      closeButton.style.border = 'none';
      closeButton.style.borderRadius = '4px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => document.body.removeChild(modal);
      
      content.appendChild(title);
      
      // Add social links
      const linkContainer = document.createElement('div');
      linkContainer.style.display = 'flex';
      linkContainer.style.flexWrap = 'wrap';
      linkContainer.style.gap = '10px';
      linkContainer.style.justifyContent = 'center';
      linkContainer.style.marginBottom = '15px';
      
      socialLinks.forEach(social => {
        const link = document.createElement('a');
        link.href = social.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'inline-flex';
        link.style.alignItems = 'center';
        link.style.justifyContent = 'center';
        link.style.padding = '8px 16px';
        link.style.backgroundColor = '#3b82f6';
        link.style.color = 'white';
        link.style.borderRadius = '4px';
        link.style.textDecoration = 'none';
        link.textContent = social.name;
        linkContainer.appendChild(link);
      });
      
      content.appendChild(linkContainer);
      content.appendChild(closeButton);
      modal.appendChild(content);
      document.body.appendChild(modal);
    }
  };

  // Add a function to handle account creation redirect
  const handleCreateAccount = () => {
    setShowAccountPrompt(false);
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
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
      if (audioDetectionIntervalRef.current) clearInterval(audioDetectionIntervalRef.current);
      stopMediaDevices();
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
              onClick={requestPermissions}
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
                <li>Your microphone will detect laughter sounds</li>
                <li>The longer you last, the higher your score</li>
                <li>You have 30 seconds to survive</li>
              </ul>
              
              <div className="mt-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  <strong>Note:</strong> This game requires camera and microphone access to detect smiles and laughter.
                  Your privacy is important - no video or audio is recorded or stored.
                </p>
              </div>
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
        
        {gameState === 'permissions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold mb-4">Camera & Microphone Access</h2>
            
            {loadingModels && (
              <div className="mb-6">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="mb-2">Loading face detection models...</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments depending on your connection.</p>
                <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-4 overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 10, ease: "linear" }}
                  />
                </div>
              </div>
            )}
            
            {!permissionsGranted && !permissionDenied && !loadingModels && (
              <>
                <p className="mb-6">
                  Please allow access to your camera and microphone when prompted.
                  This is required to detect smiles and laughter during the game.
                </p>
                
                <div className="flex justify-center gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                      <FaCamera className="text-2xl text-blue-600" />
                    </div>
                    <p className="text-sm">Camera</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2">
                      <FaMicrophone className="text-2xl text-blue-600" />
                    </div>
                    <p className="text-sm">Microphone</p>
                  </div>
                </div>
                
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg max-w-lg mx-auto mb-6">
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    <strong>Privacy Note:</strong> We do not record or store any video or audio.
                    All processing happens locally in your browser.
                  </p>
                </div>
              </>
            )}
            
            {permissionDenied && (
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCamera className="text-2xl text-red-600" />
                </div>
                <p className="text-red-600 dark:text-red-400 mb-4">
                  Camera or microphone access was denied. This game requires both to function.
                </p>
                <p className="mb-6">
                  Please allow access in your browser settings and try again.
                </p>
                <button
                  onClick={requestPermissions}
                  className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}
        
        {gameState === 'playing' && (
          <div className="flex flex-col md:flex-row h-full gap-6">
            {/* Camera feed */}
            <div className="flex-1 bg-black rounded-xl overflow-hidden relative flex items-center justify-center min-h-[200px] md:min-h-[300px]">
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
              
              {/* Microphone indicator */}
              {microphoneActive && (
                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                  <FaMicrophone className="mr-1 text-red-500 animate-pulse" />
                  <span>Listening</span>
                </div>
              )}
            </div>
            
            {/* Joke/Meme display */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl p-6 flex items-center justify-center min-h-[200px] md:min-h-[300px]">
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
                  <div className="relative w-full max-w-md h-48 md:h-64 mx-auto">
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
              {smileDetected ? "You Smiled!" : laughDetected ? "You Laughed!" : "Time's Up!"}
            </h2>
            <p className="text-lg mb-6">
              {smileDetected || laughDetected
                ? `We caught you ${smileDetected ? 'smiling' : 'laughing'}! You survived ${score} seconds.`
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