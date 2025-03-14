'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaTrophy, FaGamepad, FaShareAlt, FaCog, FaUser, FaSignOutAlt, FaChartLine, FaMedal } from 'react-icons/fa';
import Image from 'next/image';

// Sample user data
const userData = {
  username: 'GameMaster42',
  email: 'gamemaster42@example.com',
  joinDate: '2023-01-15',
  avatar: '/images/avatar.jpg',
  level: 24,
  xp: 7850,
  nextLevelXp: 10000,
  totalGamesPlayed: 387,
  achievements: [
    { id: 1, name: 'Meme Expert', description: 'Score over 9000 in Meme Quiz', icon: '🏆', unlocked: true },
    { id: 2, name: 'Roast Survivor', description: 'Get roasted 10 times in AI Roast Me', icon: '🔥', unlocked: true },
    { id: 3, name: 'Decision Maker', description: 'Answer 100 questions in Would You Rather?', icon: '🤔', unlocked: true },
    { id: 4, name: 'Truth Teller', description: 'Achieve 90% accuracy in Lie Detector', icon: '🔍', unlocked: false },
    { id: 5, name: 'Social Butterfly', description: 'Share 5 game results on social media', icon: '🦋', unlocked: false },
    { id: 6, name: 'Daily Player', description: 'Play games for 7 consecutive days', icon: '📅', unlocked: true },
  ],
  recentActivity: [
    { id: 1, game: 'Meme Quiz', score: 9450, date: '2023-06-20', rank: 3 },
    { id: 2, game: 'AI Roast Me', score: 8900, date: '2023-06-19', rank: 7 },
    { id: 3, game: 'Would You Rather?', score: 9200, date: '2023-06-18', rank: 5 },
    { id: 4, game: 'Lie Detector', score: 8700, date: '2023-06-17', rank: 9 },
    { id: 5, game: 'Meme Quiz', score: 9100, date: '2023-06-16', rank: 6 },
  ],
  gameStats: [
    { game: 'Meme Quiz', played: 145, highScore: 9750, rank: 3 },
    { game: 'AI Roast Me', played: 98, highScore: 9200, rank: 5 },
    { game: 'Would You Rather?', played: 87, highScore: 9400, rank: 4 },
    { game: 'Lie Detector', played: 57, highScore: 8900, rank: 8 },
  ],
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate XP progress percentage
  const xpProgress = (userData.xp / userData.nextLevelXp) * 100;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              {/* Profile header */}
              <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={userData.avatar}
                    alt={userData.username}
                    fill
                    className="rounded-full object-cover border-4 border-purple-500"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {userData.level}
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1">{userData.username}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Member since {new Date(userData.joinDate).toLocaleDateString()}
                </p>
                
                {/* XP progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>XP: {userData.xp.toLocaleString()}</span>
                    <span>{userData.nextLevelXp.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full"
                      style={{ width: `${xpProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-center mt-1">
                    Level {userData.level} • {Math.round(xpProgress)}% to Level {userData.level + 1}
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'overview'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FaUser className="mr-3" /> Overview
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('achievements')}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'achievements'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FaTrophy className="mr-3" /> Achievements
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('stats')}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'stats'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FaChartLine className="mr-3" /> Game Stats
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                        activeTab === 'settings'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <FaCog className="mr-3" /> Settings
                    </button>
                  </li>
                  <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full text-left px-4 py-2 rounded-lg flex items-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <FaSignOutAlt className="mr-3" /> Sign Out
                    </button>
                  </li>
                </ul>
              </nav>
            </motion.div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Overview tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 mr-4">
                      <FaGamepad className="text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Games Played</div>
                      <div className="text-2xl font-bold">{userData.totalGamesPlayed}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 mr-4">
                      <FaTrophy className="text-purple-600 dark:text-purple-400 text-xl" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Achievements</div>
                      <div className="text-2xl font-bold">
                        {userData.achievements.filter(a => a.unlocked).length}/{userData.achievements.length}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center">
                    <div className="rounded-full bg-pink-100 dark:bg-pink-900/30 p-3 mr-4">
                      <FaMedal className="text-pink-600 dark:text-pink-400 text-xl" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Best Rank</div>
                      <div className="text-2xl font-bold">
                        #{Math.min(...userData.gameStats.map(stat => stat.rank))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Recent activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {userData.recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FaGamepad className="text-gray-400 mr-3" />
                          <div>
                            <div className="font-medium">{activity.game}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(activity.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{activity.score.toLocaleString()}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Rank #{activity.rank}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Share profile */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Share Your Profile</h3>
                      <p className="text-white/80">
                        Challenge your friends to beat your high scores!
                      </p>
                    </div>
                    <button className="bg-white text-purple-600 rounded-full p-3 hover:bg-gray-100 transition-colors">
                      <FaShareAlt />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Achievements tab */}
            {activeTab === 'achievements' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold">Achievements</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    You've unlocked {userData.achievements.filter(a => a.unlocked).length} out of {userData.achievements.length} achievements
                  </p>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`border rounded-lg p-4 flex items-center ${
                        achievement.unlocked
                          ? 'border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60'
                      }`}
                    >
                      <div className="text-3xl mr-4">{achievement.icon}</div>
                      <div>
                        <div className="font-bold">{achievement.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </div>
                        <div className="text-xs mt-1">
                          {achievement.unlocked ? (
                            <span className="text-green-600 dark:text-green-400">Unlocked</span>
                          ) : (
                            <span className="text-gray-500">Locked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Game Stats tab */}
            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold">Game Statistics</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Game
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Times Played
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          High Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Global Rank
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {userData.gameStats.map((stat, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{stat.game}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {stat.played}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-bold">
                            {stat.highScore.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                              #{stat.rank}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            
            {/* Settings tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold">Account Settings</h2>
                </div>
                
                <div className="p-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        defaultValue={userData.username}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={userData.email}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        defaultValue="********"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <button
                        type="button"
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 