'use client';

import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaGamepad, FaTrophy, FaUsers, FaShareAlt, FaArrowDown, FaArrowRight, FaFire, FaStar, FaRocket, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section with New Design */}
      <section className="relative min-h-screen flex items-center overflow-hidden noise">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 to-background"></div>
        
        {/* Animated blobs */}
        <div className="absolute -z-10 w-full h-full overflow-hidden">
          <motion.div 
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-spin-slow"
            style={{ transformOrigin: 'center center' }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] animate-spin-slow"
            style={{ transformOrigin: 'center center', animationDirection: 'reverse', animationDuration: '25s' }}
          ></motion.div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <span className="inline-block bg-secondary/10 text-secondary dark:text-secondary text-sm font-medium px-4 py-2 rounded-full">
                  🎮 The Ultimate Gaming Experience
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text-secondary"
              >
                Game. Compete. <br />Conquer.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl text-neutral-700 dark:text-neutral-300 mb-8 max-w-xl mx-auto lg:mx-0"
              >
                Dive into a world of competitive mini-games designed to challenge your skills and connect you with players worldwide.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/games"
                  className="btn-secondary px-8 py-4 font-bold rounded-full flex items-center justify-center"
                >
                  <FaGamepad className="mr-2" /> Play Now
                </Link>
                
                <Link
                  href="/signup"
                  className="btn-outline text-primary dark:text-white px-8 py-4 font-bold rounded-full flex items-center justify-center"
                >
                  Create Account <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
              
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-12 grid grid-cols-3 gap-4"
              >
                {[
                  { value: "1M+", label: "Players" },
                  { value: "4", label: "Games" },
                  { value: "10M+", label: "Plays" }
                ].map((stat, index) => (
                  <div key={index} className="text-center glass-card dark:glass-card-dark p-4">
                    <div className="text-2xl md:text-3xl font-bold text-primary dark:text-accent">{stat.value}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            
            {/* 3D Game Showcase */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative h-[500px] perspective-1000"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main featured game card */}
                <motion.div
                  initial={{ rotateY: 0, rotateX: 0, y: 0 }}
                  animate={{ rotateY: [0, 5, 0, -5, 0], rotateX: [0, -5, 0, 5, 0] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 10,
                  }}
                  className="relative w-72 h-96 transform-3d"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 glass-card dark:glass-card-dark overflow-hidden shadow-2xl">
                    <div className="h-48 bg-gradient-to-r from-secondary to-warning relative overflow-hidden">
                      <img 
                        src="/images/Who_can_click_the_fatest.jpg" 
                        alt="Speed Tap"
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-warning/80"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-3xl font-bold">Speed Tap</div>
                      </div>
                      <div className="absolute top-4 right-4 bg-warning/80 text-primary text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <FaFire className="mr-1" /> HOT
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2 text-neutral-800 dark:text-neutral-100">Test Your Reflexes</h3>
                      <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
                        How fast can you tap? Challenge your friends and climb the global leaderboard!
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar key={star} className="text-warning text-xs" />
                            ))}
                          </div>
                          <span className="text-xs ml-1 text-neutral-500 dark:text-neutral-400">4.9</span>
                        </div>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">250K+ plays</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Secondary game cards */}
                <motion.div
                  initial={{ x: -160, y: -60, rotateY: 15, rotateZ: -5, scale: 0.7 }}
                  animate={{ 
                    y: [-60, -70, -60],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    repeatType: "reverse"
                  }}
                  className="absolute transform-3d"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-64 h-80 glass-card dark:glass-card-dark overflow-hidden shadow-xl">
                    <div className="h-40 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
                      <img 
                        src="/images/ai_roast_me.jpg" 
                        alt="AI Roast Me"
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-2xl font-bold">AI Roast Me</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ x: 160, y: 60, rotateY: -15, rotateZ: 5, scale: 0.7 }}
                  animate={{ 
                    y: [60, 70, 60],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3.5,
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                  className="absolute transform-3d"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="w-64 h-80 glass-card dark:glass-card-dark overflow-hidden shadow-xl">
                    <div className="h-40 bg-gradient-to-r from-accent to-success relative overflow-hidden">
                      <img 
                        src="/images/you_laugh_you_lose.jpg" 
                        alt="You Laugh You Lose"
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/80 to-success/80"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-2xl font-bold">You Laugh You Lose</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <FaArrowDown className="text-secondary text-2xl animate-bounce" />
          </motion.div>
        </div>
      </section>
      
      {/* Featured Games Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-neutral-100/50 dark:bg-neutral-900/30"></div>
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-primary">
              Featured Games
            </h2>
            <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
              Discover our collection of addictive games designed for quick fun and fierce competition.
            </p>
          </motion.div>

          {/* Game cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: 'ai-roast-me',
                title: 'AI Roast Me',
                description: 'Submit a photo or fun fact and get humorously "roasted" by our AI.',
                gradient: 'from-secondary to-warning',
                icon: <FaFire />,
                playerCount: '8.7K',
                isNew: true,
                isFeatured: true,
                imageUrl: '/images/ai_roast_me.jpg',
              },
              {
                id: 'escape-viral-trend',
                title: 'Escape the Viral Trend',
                description: 'Solve puzzles based on trending social media crazes before time runs out.',
                gradient: 'from-accent to-success',
                icon: <FaRocket />,
                playerCount: '15.3K',
                isNew: true,
                isFeatured: true,
                imageUrl: '/images/Escape_the_viral_trend.jpg',
              },
              {
                id: 'speed-click',
                title: 'Who Can Click the Fastest?',
                description: 'You have 1 second to click as many times as possible. Compete globally!',
                gradient: 'from-primary to-accent',
                icon: <FaGamepad />,
                playerCount: '21.5K',
                isNew: false,
                isFeatured: true,
                imageUrl: '/images/Who_can_click_the_fatest.jpg',
              },
              {
                id: 'you-laugh-you-lose',
                title: 'You Laugh, You Lose',
                description: 'AI generates funny content while your webcam detects if you smile.',
                gradient: 'from-primary to-secondary',
                icon: <FaChartLine />,
                playerCount: '9.2K',
                isNew: true,
                isFeatured: false,
                imageUrl: '/images/you_laugh_you_lose.jpg',
              }
            ].map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="glass-card dark:glass-card-dark overflow-hidden h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className={`h-40 bg-gradient-to-r ${game.gradient} relative p-6 overflow-hidden`}>
                    {/* Add game image as background */}
                    <div className="absolute inset-0">
                      <img 
                        src={game.imageUrl} 
                        alt={game.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r opacity-80 mix-blend-multiply" style={{backgroundImage: `linear-gradient(to right, var(--${game.gradient.split('-')[1]}), var(--${game.gradient.split('-')[3]}))`}}></div>
                    </div>
                    
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      {game.isNew && (
                        <span className="bg-success text-white text-xs font-bold px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                      {game.isFeatured && (
                        <span className="bg-warning text-primary text-xs font-bold px-2 py-1 rounded-full">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 text-white z-10">
                      <div className="text-3xl mb-1">{game.icon}</div>
                      <h3 className="text-xl font-bold">{game.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                      {game.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
                        <FaUsers className="mr-1" />
                        {game.playerCount} players
                      </span>
                      
                      <Link 
                        href={`/games/${game.id}`}
                        className="btn-secondary px-3 py-2 rounded-full text-sm font-medium flex items-center"
                      >
                        Play <FaArrowRight className="ml-1" size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/games"
              className="btn-outline text-primary dark:text-white px-6 py-3 rounded-full font-medium inline-flex items-center"
            >
              View All Games <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-accent/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-primary">
              Why Players Love Us
            </h2>
            <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
              We've created the ultimate gaming platform with features designed for competitive players.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaGamepad className="text-secondary text-4xl" />,
                title: "Quick Games",
                description: "Jump into fast-paced games that you can play in minutes, perfect for short breaks."
              },
              {
                icon: <FaTrophy className="text-primary text-4xl" />,
                title: "Global Rankings",
                description: "Compete with players worldwide and see your name rise on our global leaderboards."
              },
              {
                icon: <FaUsers className="text-accent text-4xl" />,
                title: "Social Play",
                description: "Challenge friends, join tournaments, and build your gaming reputation."
              },
              {
                icon: <FaShareAlt className="text-success text-4xl" />,
                title: "Share Results",
                description: "Show off your achievements and challenge friends on social media."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card dark:glass-card-dark p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
              >
                <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-neutral-100">{feature.title}</h3>
                <p className="text-neutral-700 dark:text-neutral-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                value: "1M+",
                label: "Active Players",
                gradient: "from-primary to-accent"
              },
              {
                value: "4+",
                label: "Viral Games",
                gradient: "from-secondary to-warning"
              },
              {
                value: "10M+",
                label: "Games Played",
                gradient: "from-accent to-success"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card dark:glass-card-dark overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${stat.gradient} text-white p-10 text-center`}>
                  <div className="text-6xl font-bold mb-2">{stat.value}</div>
                  <div className="text-xl">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary -z-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3"></div>
          
          {/* Animated particles */}
          <AnimatedParticles />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-white max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Play?</h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of players already competing in our games. No downloads required - play instantly in your browser!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/games"
                className="bg-white text-primary px-8 py-4 font-bold rounded-full hover:bg-neutral-100 transition-all hover:scale-105 shadow-xl flex items-center justify-center"
              >
                <FaGamepad className="mr-2" /> Play Now
              </Link>
              
              <Link
                href="/signup"
                className="bg-transparent border-2 border-white text-white px-8 py-4 font-bold rounded-full hover:bg-white/10 transition-all hover:scale-105 flex items-center justify-center"
              >
                <FaUsers className="mr-2" /> Create Account
              </Link>
            </div>
            
            <p className="mt-8 text-white/80 text-sm">
              No sign-up required to play. Create an account to save progress and compete on leaderboards.
            </p>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}

const AnimatedParticles = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) return null;
  
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full"
          initial={{ 
            x: Math.random() * 100 - 50 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{ 
            y: [null, Math.random() * -50 - 10 + "%"],
            opacity: [null, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: Math.random() * 10 + 10,
            ease: "linear"
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </>
  );
};
