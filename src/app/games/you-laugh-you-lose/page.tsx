'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaShareAlt, FaTrophy, FaCamera, FaLaugh, FaSmile, FaFrown, FaVideo, FaVideoSlash } from 'react-icons/fa';
import Link from 'next/link';
import Confetti from 'react-confetti';

// Sample jokes for the game
const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Parallel lines have so much in common. It's a shame they'll never meet.",
  "My wife told me to stop impersonating a flamingo. I had to put my foot down.",
  "I bought some shoes from a drug dealer. I don't know what he laced them with, but I've been tripping all day.",
  "Why did the scarecrow win an award? Because he was outstanding in his field!",
  "I'm on a seafood diet. I see food and I eat it.",
  "What do you call a fake noodle? An impasta!",
  "How do you organize a space party? You planet!",
  "I would tell you a chemistry joke, but I know I wouldn't get a reaction.",
  "I used to be a baker, but I couldn't make enough dough.",
  "Why don't skeletons fight each other? They don't have the guts.",
  "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
  "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
  "Why was the math book sad? It had too many problems.",
  "What did the janitor say when he jumped out of the closet? Supplies!",
  "Why did the chicken go to the séance? To get to the other side.",
  "What's orange and sounds like a parrot? A carrot.",
  "How do you make holy water? You boil the hell out of it.",
  "I'm reading a book about anti-gravity. It's impossible to put down!"
];

// Sample memes for the game
const memes = [
  "/images/ai_roast_me.jpg",
  "/images/Escape_the_viral_trend.jpg",
  "/images/Who_can_click_the_fatest.jpg",
  "/images/you_laugh_you_lose.jpg",
  "/images/placeholder.jpg"
];

export default function YouLaughYouLosePage() {
  const [gameState, setGameState] = useState<'intro' | 'setup' | 'playing' | 'result'>('intro');
  const [contentType, setContentType] = useState<'jokes' | 'memes'>('jokes');
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [smileDetected, setSmileDetected] = useState(false);
  const [lostGame, setLostGame] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [hasPlayedFreeGame, setHasPlayedFreeGame] = useState(false);
  const [freeTrialEnded, setFreeTrialEnded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Face API mock (in a real app, this would use a face detection library)
  const mockDetectSmile = () => {
    // For demo purposes, randomly detect a smile 20% of the time
    const hasSmiled = Math.random() < 0.2;
    return hasSmiled;
  };
  
  // Start camera
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Add event listener to confirm video is playing
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
              console.log("Camera started successfully");
              setCameraEnabled(true);
            }).catch(e => {
              console.error("Error playing video:", e);
              alert("Could not start video playback. Please check your browser settings and try again.");
            });
          };
        }
      } else {
        console.error("getUserMedia not supported");
        handleNoCameraFallback("Your browser doesn't support camera access. Switching to memes mode instead.");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      if (error instanceof DOMException && error.name === "NotFoundError") {
        handleNoCameraFallback("No camera was found on your device. Switching to memes mode instead.");
      } else if (error instanceof DOMException && error.name === "NotAllowedError") {
        alert("Camera access was denied. Please allow camera access in your browser settings and try again.");
      } else {
        handleNoCameraFallback("Could not access your camera. Switching to memes mode instead.");
      }
    }
  };
  
  // Handle no camera fallback
  const handleNoCameraFallback = (message: string) => {
    alert(message);
    // Switch to memes mode automatically
    setContentType('memes');
    beginGameplay();
  };
  
  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraEnabled(false);
    }
  };
  
  // Start the game
  const startGame = (type: 'jokes' | 'memes') => {
    setContentType(type);
    setGameState('setup');
    setCurrentContentIndex(0);
    setTimeLeft(60);
    setScore(0);
    setLostGame(false);
    setSmileDetected(false);
    
    // Skip camera setup for demo purposes
    if (type === 'memes') {
      beginGameplay();
    }
  };
  
  // Begin gameplay after camera setup
  const beginGameplay = () => {
    // For memes, we don't need camera
    if (contentType === 'memes' && !cameraEnabled) {
      setGameState('playing');
      
      // Start the timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }
    
    if (contentType === 'jokes' && !cameraEnabled) {
      alert("Please enable your camera to play with jokes!");
      return;
    }
    
    setGameState('playing');
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start smile detection only for jokes mode
    if (contentType === 'jokes') {
      startSmileDetection();
    }
  };
  
  // Start smile detection
  const startSmileDetection = () => {
    detectionIntervalRef.current = setInterval(() => {
      if (gameState !== 'playing') return;
      
      // Capture video frame to canvas for analysis
      if (videoRef.current && canvasRef.current && cameraEnabled) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.drawImage(
            videoRef.current, 
            0, 0, 
            canvasRef.current.width, 
            canvasRef.current.height
          );
          
          // In a real app, we would analyze the canvas image here
          // For demo, we'll use our mock function
          const hasSmiled = mockDetectSmile();
          
          if (hasSmiled) {
            setSmileDetected(true);
            endGame(true);
          }
        }
      }
    }, 500); // Check every 500ms
  };
  
  // Show next content
  const showNextContent = () => {
    // Increase score
    setScore(prev => prev + 1);
    
    // Move to next content
    if (contentType === 'jokes') {
      const nextIndex = (currentContentIndex + 1) % jokes.length;
      setCurrentContentIndex(nextIndex);
    } else {
      const nextIndex = (currentContentIndex + 1) % memes.length;
      setCurrentContentIndex(nextIndex);
    }
  };
  
  // End the game
  const endGame = (lost: boolean) => {
    setGameState('result');
    setLostGame(lost);
    
    if (!lost) {
      setShowConfetti(true);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
    
    // Clean up
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
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
  
  // Share score to social media
  const shareScore = () => {
    // In a real app, this would integrate with social media APIs
    alert(`Sharing score: ${score} ${contentType} without laughing!`);
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);
  
  // Get current content
  const getCurrentContent = () => {
    if (contentType === 'jokes') {
      return jokes[currentContentIndex];
    } else {
      return memes[currentContentIndex];
    }
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

  // Add a privacy notice component
  const PrivacyNotice = () => (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
      <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Privacy Notice:</h3>
      <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
        • Jokes mode requires webcam access to detect smiles
      </p>
      <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
        • Your camera feed is processed locally in your browser
      </p>
      <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
        • No video is recorded or stored on our servers
      </p>
      <p className="text-sm text-blue-700 dark:text-blue-400">
        • You can play with memes instead if you prefer not to use your camera
      </p>
    </div>
  );

  // Add this useEffect to handle autoplay policy
  useEffect(() => {
    // Check if video is playing when cameraEnabled is true
    if (cameraEnabled && videoRef.current) {
      const checkVideoPlaying = () => {
        if (videoRef.current && videoRef.current.paused) {
          console.log("Video is paused, attempting to play");
          videoRef.current.play().catch(e => {
            console.error("Could not autoplay video:", e);
          });
        }
      };
      
      // Check immediately and then every second
      checkVideoPlaying();
      const interval = setInterval(checkVideoPlaying, 1000);
      
      return () => clearInterval(interval);
    }
  }, [cameraEnabled]);

  // Add a debug component
  const CameraDebugInfo = () => {
    const [debugInfo, setDebugInfo] = useState<string>('Checking camera status...');
    
    useEffect(() => {
      const updateDebugInfo = () => {
        if (!navigator.mediaDevices) {
          setDebugInfo('MediaDevices API not available in this browser');
          return;
        }
        
        if (!videoRef.current) {
          setDebugInfo('Video element not initialized');
          return;
        }
        
        if (!videoRef.current.srcObject) {
          setDebugInfo('No media stream attached to video element');
          return;
        }
        
        const stream = videoRef.current.srcObject as MediaStream;
        const videoTracks = stream.getVideoTracks();
        
        if (videoTracks.length === 0) {
          setDebugInfo('No video tracks in media stream');
          return;
        }
        
        const track = videoTracks[0];
        setDebugInfo(`Camera active: ${track.enabled ? 'Yes' : 'No'}, 
                      Label: ${track.label}, 
                      Video paused: ${videoRef.current.paused ? 'Yes' : 'No'}`);
      };
      
      updateDebugInfo();
      const interval = setInterval(updateDebugInfo, 1000);
      
      return () => clearInterval(interval);
    }, [cameraEnabled]);
    
    return (
      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
        <p>Debug: {debugInfo}</p>
        <button 
          onClick={() => {
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.play().catch(e => console.error("Manual play failed:", e));
            }
          }}
          className="mt-1 px-2 py-1 bg-blue-500 text-white text-xs rounded"
        >
          Force Play
        </button>
      </div>
    );
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
          
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            You Laugh, You Lose
          </h1>
          
          <Link
            href="/leaderboards"
            className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-8">
                  <h2 className="text-2xl font-bold mb-4">Keep a Straight Face!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Can you keep a straight face while viewing our hilarious content? 
                    Try not to laugh at our funny memes and jokes!
                  </p>
                  
                  {/* Add privacy notice */}
                  <PrivacyNotice />
                  
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-2">How to Play:</h3>
                    <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                      <li>• Choose between jokes or memes</li>
                      <li>• Try not to smile or laugh as content appears</li>
                      <li>• Jokes mode requires webcam access to detect if you laugh</li>
                      <li>• Memes mode lets you play without webcam</li>
                      <li>• Earn points for each joke/meme you survive</li>
                      <li>• Challenge friends to beat your score!</li>
                    </ul>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => startGame('jokes')}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                    >
                      <span className="flex items-center justify-center">
                        <FaVideo className="mr-2" />
                        Play with Jokes
                        <small className="ml-2 text-xs bg-white text-purple-600 px-2 py-1 rounded-full">Requires Webcam</small>
                      </span>
                    </button>
                    
                    <button
                      onClick={() => startGame('memes')}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                    >
                      <span className="flex items-center justify-center">
                        <FaLaugh className="mr-2" />
                        Play with Memes
                        <small className="ml-2 text-xs bg-white text-blue-600 px-2 py-1 rounded-full">No Webcam Needed</small>
                      </span>
                    </button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center">
                      <FaCamera className="mr-2 text-purple-500" />
                      <strong>No webcam?</strong> Choose the "Play with Memes" option to play without a camera.
                    </p>
                  </div>
                  
                  {hasPlayedFreeGame && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-700 dark:text-yellow-400 font-medium">
                        You've played your free game! Create an account to continue playing and save your scores.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>Note: Jokes mode requires webcam access. Your camera feed is processed locally and is not recorded or stored.</p>
              </div>
            </motion.div>
          )}
          
          {/* Camera setup screen */}
          {gameState === 'setup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Camera Setup</h2>
                
                <div className="mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                    <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Why we need camera access:</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      To detect if you smile or laugh during the game. Your camera feed is processed locally in your browser and is never recorded or stored on our servers.
                    </p>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
                    We need access to your webcam to detect if you laugh or smile.
                    Your camera feed is processed locally and is not recorded or stored.
                  </p>
                  
                  <div className="relative w-full max-w-md mx-auto aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                    {cameraEnabled ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <FaCamera className="text-gray-500 text-5xl mb-2" />
                        <p className="text-gray-400 text-sm">Camera not enabled yet</p>
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 right-2 flex items-center">
                      {cameraEnabled ? (
                        <span className="flex items-center bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                          Camera Active
                        </span>
                      ) : (
                        <span className="flex items-center bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                          Camera Off
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {!cameraEnabled && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
                      <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">Camera Troubleshooting:</h3>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                        <li>• Make sure your device has a working webcam</li>
                        <li>• Check if other applications are using your camera</li>
                        <li>• Ensure you've granted camera permissions to this website</li>
                        <li>• If you don't have a camera, you can play with memes instead</li>
                      </ul>
                    </div>
                  )}
                  
                  {cameraEnabled && <CameraDebugInfo />}
                  
                  {/* Hidden canvas for processing video frames */}
                  <canvas 
                    ref={canvasRef}
                    width="320"
                    height="240"
                    className="hidden"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!cameraEnabled ? (
                    <>
                      <button
                        onClick={startCamera}
                        className="px-6 py-3 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-600 transition-colors flex items-center justify-center"
                      >
                        <FaVideo className="mr-2" /> Enable Camera
                      </button>
                      
                      <button
                        onClick={() => {
                          // Switch to memes mode if user doesn't want to use camera
                          setContentType('memes');
                          beginGameplay();
                        }}
                        className="px-6 py-3 bg-gray-500 text-white font-medium rounded-full hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        Play with Memes Instead
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={stopCamera}
                        className="px-6 py-3 bg-gray-500 text-white font-medium rounded-full hover:bg-gray-600 transition-colors flex items-center justify-center"
                      >
                        <FaVideoSlash className="mr-2" /> Disable Camera
                      </button>
                      
                      <button
                        onClick={beginGameplay}
                        className="px-6 py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-colors flex items-center justify-center"
                      >
                        Start Game
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Playing screen */}
          {gameState === 'playing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Timer and score */}
              <div className="bg-gray-100 dark:bg-gray-700 p-4 flex justify-between items-center">
                <div className="text-lg font-bold text-purple-500">
                  Score: {score}
                </div>
                
                <div className="text-lg font-mono font-bold">
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <div className="p-6">
                <div className={`grid grid-cols-1 ${contentType === 'jokes' && cameraEnabled ? 'md:grid-cols-2' : ''} gap-6`}>
                  {/* Content side */}
                  <div className="bg-gray-50 dark:bg-gray-750 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4 text-center">
                      {contentType === 'jokes' ? 'Try Not to Laugh!' : 'Keep a Straight Face!'}
                    </h3>
                    
                    {contentType === 'jokes' ? (
                      <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-inner min-h-[200px] flex items-center justify-center">
                        <p className="text-xl">{getCurrentContent()}</p>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-inner">
                        <img 
                          src={getCurrentContent()} 
                          alt="Funny meme" 
                          className="max-w-full h-auto mx-auto rounded"
                        />
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={showNextContent}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Next {contentType === 'jokes' ? 'Joke' : 'Meme'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Camera side - only show if using jokes mode with camera */}
                  {contentType === 'jokes' && cameraEnabled && (
                    <div className="bg-gray-50 dark:bg-gray-750 p-6 rounded-lg">
                      <h3 className="text-xl font-bold mb-4 text-center">
                        Your Face
                      </h3>
                      
                      <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                        
                        {smileDetected && (
                          <div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center">
                            <div className="text-white text-3xl font-bold">
                              Smile Detected!
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute bottom-2 right-2 flex items-center">
                          <span className="flex items-center bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                            Live
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-center text-gray-600 dark:text-gray-400">
                        <p>Don't smile or laugh!</p>
                      </div>
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
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {lostGame ? "You Laughed, You Lost!" : "Time's Up!"}
                </h2>
                
                <div className="mb-8 text-center">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    lostGame 
                      ? 'bg-red-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {lostGame ? (
                      <FaLaugh className="text-5xl text-white" />
                    ) : (
                      <FaFrown className="text-5xl text-white" />
                    )}
                  </div>
                  
                  <div className="text-5xl font-bold text-purple-500 mb-2">{score}</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {contentType === 'jokes' ? 'Jokes' : 'Memes'} survived without laughing
                  </p>
                  
                  <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium mb-2">
                      {lostGame 
                        ? "We caught you smiling! Better luck next time." 
                        : "Impressive! You managed to keep a straight face the whole time."}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {score > 10 
                        ? "You have incredible self-control!" 
                        : "Keep practicing your poker face!"}
                    </p>
                  </div>
                  
                  {freeTrialEnded && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-yellow-700 dark:text-yellow-400 font-medium mb-2">
                        You've played your free game!
                      </p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-500">
                        Create an account to continue playing and save your scores.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {freeTrialEnded ? (
                    <>
                      <button
                        onClick={handleCreateAccount}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
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
                        onClick={shareScore}
                        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
                      >
                        <FaShareAlt className="mr-2" /> Share Score
                      </button>
                      
                      <button
                        onClick={() => startGame(contentType)}
                        className="px-6 py-3 bg-purple-500 text-white font-medium rounded-full hover:bg-purple-600 transition-colors flex items-center justify-center"
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrophy className="text-purple-500 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You've Completed Your Free Game!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create an account to unlock unlimited games, save your scores, and compete on leaderboards.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h3 className="font-bold mb-2">Account Benefits:</h3>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Unlimited access to all games
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Save your high scores and progress
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Compete on global leaderboards
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Challenge friends and share results
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreateAccount}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
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