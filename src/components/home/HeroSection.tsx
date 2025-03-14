'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaGamepad, FaArrowRight } from 'react-icons/fa';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: 'Meme Quiz',
      description: 'Test your knowledge of viral memes and internet culture.',
      image: '/images/games/meme-quiz.jpg',
      color: 'from-blue-600 to-indigo-600',
      path: '/games/meme-quiz',
    },
    {
      title: 'AI Roast Me',
      description: 'Get humorously "roasted" by our AI. Can you handle the heat?',
      image: '/images/games/ai-roast.jpg',
      color: 'from-red-600 to-orange-600',
      path: '/games/ai-roast-me',
    },
    {
      title: 'Would You Rather?',
      description: 'Make impossible choices and see how your answers compare to others.',
      image: '/images/games/would-you-rather.jpg',
      color: 'from-purple-600 to-pink-600',
      path: '/games/would-you-rather',
    },
    {
      title: 'Lie Detector',
      description: 'Can our AI tell if you\'re lying? Put it to the test!',
      image: '/images/games/lie-detector.jpg',
      color: 'from-green-600 to-teal-600',
      path: '/games/lie-detector',
    },
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-600/20" />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                Multiple Games, One Platform
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
            >
              Play, Share, Connect at ViralArcade
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Your one-stop gaming destination with viral games that are perfect for sharing with friends and challenging your skills.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/games"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <FaGamepad className="mr-2" /> Browse Games
              </Link>
              
              <Link
                href="/signup"
                className="px-6 py-3 bg-white text-purple-600 font-medium rounded-full border border-purple-200 hover:bg-purple-50 transition-colors flex items-center justify-center"
              >
                Create Account <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Featured game carousel */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Game image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${slide.color} opacity-60`} />
                </div>
                
                {/* Game info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                  <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                  <p className="mb-4 text-white/90">{slide.description}</p>
                  <Link
                    href={slide.path}
                    className="inline-block px-4 py-2 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
                  >
                    Play Now
                  </Link>
                </div>
              </div>
            ))}
            
            {/* Slide indicators */}
            <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 