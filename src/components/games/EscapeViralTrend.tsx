'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { BsTiktok, BsInstagram, BsYoutube, BsTwitter } from 'react-icons/bs';

const PLAYER_SIZE = 30;
const TREND_SIZE = 40;

export default function EscapeViralTrend() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStatus, setGameStatus] = useState<'intro' | 'playing' | 'gameover'>('intro');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const animationFrameId = useRef<number>();
  const lastTime = useRef(performance.now());

  const player = useRef({
    x: 0,
    y: 0,
    speed: 5
  });

  const trends = useRef<Array<{ x: number; y: number; icon: string }>>([]);

  useEffect(() => {
    // Cleanup animation frame on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const startGame = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Initialize player position
    player.current = {
      x: canvas.width / 2 - PLAYER_SIZE / 2,
      y: canvas.height - PLAYER_SIZE - 10,
      speed: 5
    };

    // Clear trends
    trends.current = [];

    // Reset score
    setScore(0);
    setGameStatus('playing');
    lastTime.current = performance.now();
    gameLoop();
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime.current;
    lastTime.current = currentTime;

    // Clear canvas
    context.fillStyle = '#1a1a1a';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player
    context.fillStyle = 'white';
    context.fillRect(player.current.x, player.current.y, PLAYER_SIZE, PLAYER_SIZE);

    // Update and draw trends
    if (Math.random() < 0.02) { // 2% chance each frame to spawn a trend
      trends.current.push({
        x: Math.random() * (canvas.width - TREND_SIZE),
        y: -TREND_SIZE,
        icon: ['tiktok', 'instagram', 'youtube', 'twitter'][Math.floor(Math.random() * 4)]
      });
    }

    // Update trends
    trends.current = trends.current.filter(trend => {
      trend.y += 2; // Move trend down
      
      // Draw trend
      context.fillStyle = 'blue';
      context.fillRect(trend.x, trend.y, TREND_SIZE, TREND_SIZE);

      // Check collision with player
      if (trend.y + TREND_SIZE > player.current.y &&
          trend.y < player.current.y + PLAYER_SIZE &&
          trend.x + TREND_SIZE > player.current.x &&
          trend.x < player.current.x + PLAYER_SIZE) {
        setGameStatus('gameover');
        if (score > highScore) {
          setHighScore(score);
          setShowConfetti(true);
        }
        return false;
      }

      // Remove if off screen
      if (trend.y > canvas.height) {
        setScore(prev => prev + 1);
        return false;
      }

      return true;
    });

    if (gameStatus === 'playing') {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== 'playing') return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      switch (e.key) {
        case 'ArrowLeft':
          player.current.x = Math.max(0, player.current.x - player.current.speed);
          break;
        case 'ArrowRight':
          player.current.x = Math.min(canvas.width - PLAYER_SIZE, player.current.x + player.current.speed);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus]);

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col relative bg-gray-900">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 500}
          height={typeof window !== 'undefined' ? window.innerHeight : 500}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="flex-1 p-6 relative flex flex-col">
        <AnimatePresence mode="wait">
          {gameStatus === 'intro' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl font-bold mb-6">Escape the Viral Trend</h1>
              <p className="text-xl mb-8">
                Stay sane in the age of viral trends! Dodge the social media challenges and keep your cringe meter low.
              </p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                <FaPlay className="mr-2" /> Start Game
              </button>
            </motion.div>
          )}

          {gameStatus === 'playing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex-1 flex flex-col"
            >
              <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
                <div className="bg-gray-800 bg-opacity-90 px-4 py-2 rounded-full">
                  <span className="text-white font-bold">Score: {score}</span>
                </div>
                <div className="bg-gray-800 bg-opacity-90 px-4 py-2 rounded-full">
                  <span className="text-white font-bold">High Score: {highScore}</span>
                </div>
              </div>

              <canvas
                ref={canvasRef}
                className="flex-1 bg-gray-900 w-full h-full"
                style={{ touchAction: 'none' }}
              />

              <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                <div className="inline-block bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                  Use ← → arrow keys to move
                </div>
              </div>
            </motion.div>
          )}

          {gameStatus === 'gameover' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center text-white"
            >
              <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-4">Final Score: {score}</p>
              <p className="text-xl mb-8">High Score: {highScore}</p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                <FaPlay className="mr-2" /> Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 