'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaGamepad, FaCalendarAlt, FaFilter, FaSearch } from 'react-icons/fa';
import Image from 'next/image';

export default function LeaderboardPage() {
  const [activeGame, setActiveGame] = useState('all');
  const [timeRange, setTimeRange] = useState('all-time');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample leaderboard data
  const leaderboardData = {
    'speed-click': [
      { id: 1, username: 'SpeedDemon', avatar: '/images/avatars/avatar1.jpg', score: 87, date: '2023-06-15' },
      { id: 2, username: 'ClickMaster', avatar: '/images/avatars/avatar2.jpg', score: 82, date: '2023-06-18' },
      { id: 3, username: 'TapKing', avatar: '/images/avatars/avatar3.jpg', score: 79, date: '2023-06-12' },
      { id: 4, username: 'FastFingers', avatar: '/images/avatars/avatar4.jpg', score: 76, date: '2023-06-20' },
      { id: 5, username: 'SpeedyGonzales', avatar: '/images/avatars/avatar5.jpg', score: 74, date: '2023-06-17' },
      { id: 6, username: 'RapidClicker', avatar: '/images/avatars/avatar6.jpg', score: 71, date: '2023-06-19' },
      { id: 7, username: 'TapMaster', avatar: '/images/avatars/avatar7.jpg', score: 68, date: '2023-06-14' },
      { id: 8, username: 'ClickNinja', avatar: '/images/avatars/avatar8.jpg', score: 65, date: '2023-06-16' },
      { id: 9, username: 'SpeedTapper', avatar: '/images/avatars/avatar9.jpg', score: 62, date: '2023-06-13' },
      { id: 10, username: 'QuickTap', avatar: '/images/avatars/avatar10.jpg', score: 59, date: '2023-06-11' },
    ],
    'you-laugh-you-lose': [
      { id: 1, username: 'SeriousFace', avatar: '/images/avatars/avatar11.jpg', score: 180, date: '2023-06-14' },
      { id: 2, username: 'NoLaughs', avatar: '/images/avatars/avatar12.jpg', score: 175, date: '2023-06-17' },
      { id: 3, username: 'StoneFace', avatar: '/images/avatars/avatar13.jpg', score: 168, date: '2023-06-19' },
      { id: 4, username: 'PokerFace', avatar: '/images/avatars/avatar14.jpg', score: 162, date: '2023-06-15' },
      { id: 5, username: 'DeadpanKing', avatar: '/images/avatars/avatar15.jpg', score: 155, date: '2023-06-18' },
      { id: 6, username: 'NoSmiles', avatar: '/images/avatars/avatar16.jpg', score: 149, date: '2023-06-16' },
      { id: 7, username: 'SeriousBusiness', avatar: '/images/avatars/avatar17.jpg', score: 142, date: '2023-06-20' },
      { id: 8, username: 'NoGiggles', avatar: '/images/avatars/avatar18.jpg', score: 138, date: '2023-06-13' },
      { id: 9, username: 'StraightFace', avatar: '/images/avatars/avatar19.jpg', score: 132, date: '2023-06-12' },
      { id: 10, username: 'NoChuckles', avatar: '/images/avatars/avatar20.jpg', score: 128, date: '2023-06-11' },
    ],
    'ai-roast-me': [
      { id: 1, username: 'RoastMaster', avatar: '/images/avatars/avatar21.jpg', score: 95, date: '2023-06-14' },
      { id: 2, username: 'BurnVictim', avatar: '/images/avatars/avatar22.jpg', score: 92, date: '2023-06-17' },
      { id: 3, username: 'CritiqueKing', avatar: '/images/avatars/avatar23.jpg', score: 89, date: '2023-06-19' },
      { id: 4, username: 'SavageQueen', avatar: '/images/avatars/avatar24.jpg', score: 86, date: '2023-06-15' },
      { id: 5, username: 'RoastBeef', avatar: '/images/avatars/avatar25.jpg', score: 83, date: '2023-06-18' },
      { id: 6, username: 'BurnNotice', avatar: '/images/avatars/avatar26.jpg', score: 80, date: '2023-06-16' },
      { id: 7, username: 'FlameOn', avatar: '/images/avatars/avatar27.jpg', score: 77, date: '2023-06-20' },
      { id: 8, username: 'SizzleMaster', avatar: '/images/avatars/avatar28.jpg', score: 74, date: '2023-06-13' },
      { id: 9, username: 'HeatWave', avatar: '/images/avatars/avatar29.jpg', score: 71, date: '2023-06-12' },
      { id: 10, username: 'BurnUnit', avatar: '/images/avatars/avatar30.jpg', score: 68, date: '2023-06-11' },
    ],
    'escape-viral-trend': [
      { id: 1, username: 'TrendEscaper', avatar: '/images/avatars/avatar31.jpg', score: 1250, date: '2023-06-14' },
      { id: 2, username: 'ViralDodger', avatar: '/images/avatars/avatar32.jpg', score: 1180, date: '2023-06-17' },
      { id: 3, username: 'TrendBuster', avatar: '/images/avatars/avatar33.jpg', score: 1120, date: '2023-06-19' },
      { id: 4, username: 'MemeAvoider', avatar: '/images/avatars/avatar34.jpg', score: 1080, date: '2023-06-15' },
      { id: 5, username: 'TrendSetter', avatar: '/images/avatars/avatar35.jpg', score: 1040, date: '2023-06-18' },
      { id: 6, username: 'ViralEscapist', avatar: '/images/avatars/avatar36.jpg', score: 990, date: '2023-06-16' },
      { id: 7, username: 'TrendRunner', avatar: '/images/avatars/avatar37.jpg', score: 950, date: '2023-06-20' },
      { id: 8, username: 'MemeEscaper', avatar: '/images/avatars/avatar38.jpg', score: 920, date: '2023-06-13' },
      { id: 9, username: 'ViralEvader', avatar: '/images/avatars/avatar39.jpg', score: 880, date: '2023-06-12' },
      { id: 10, username: 'TrendJumper', avatar: '/images/avatars/avatar40.jpg', score: 850, date: '2023-06-11' },
    ]
  };

  // Game options
  const gameOptions = [
    { id: 'all', name: 'All Games', icon: <FaGamepad /> },
    { id: 'speed-click', name: 'Speed Click', icon: <FaGamepad /> },
    { id: 'you-laugh-you-lose', name: 'You Laugh You Lose', icon: <FaGamepad /> },
    { id: 'ai-roast-me', name: 'AI Roast Me', icon: <FaGamepad /> },
    { id: 'escape-viral-trend', name: 'Escape the Viral Trend', icon: <FaGamepad /> },
  ];

  // Time range options
  const timeRangeOptions = [
    { id: 'all-time', name: 'All Time' },
    { id: 'this-week', name: 'This Week' },
    { id: 'this-month', name: 'This Month' },
  ];

  // Get all leaderboard entries if 'all' is selected, otherwise filter by game
  let leaderboardEntries = activeGame === 'all'
    ? Object.values(leaderboardData).flat()
    : leaderboardData[activeGame as keyof typeof leaderboardData] || [];

  // Filter by search query if provided
  if (searchQuery) {
    leaderboardEntries = leaderboardEntries.filter(entry =>
      entry.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort by score (highest first)
  leaderboardEntries.sort((a, b) => b.score - a.score);

  // Take top 20
  leaderboardEntries = leaderboardEntries.slice(0, 20);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboards</h1>
        <p className="text-gray-600 dark:text-gray-300">
          See who's topping the charts and compete for the highest scores
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Game filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <FaGamepad className="mr-2 text-gray-500" />
            <h3 className="font-medium">Select Game</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {gameOptions.map(game => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center ${
                  activeGame === game.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-1">{game.icon}</span>
                {game.name}
              </button>
            ))}
          </div>
        </div>

        {/* Time range filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <h3 className="font-medium">Time Range</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {timeRangeOptions.map(range => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  timeRange === range.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <FaSearch className="mr-2 text-gray-500" />
            <h3 className="font-medium">Search Players</h3>
          </div>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter username..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Leaderboard table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboardEntries.length > 0 ? (
                leaderboardEntries.map((entry, index) => (
                  <motion.tr
                    key={`${entry.id}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={index < 3 ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index === 0 ? (
                        <FaTrophy className="text-yellow-500 text-xl" />
                      ) : index === 1 ? (
                        <FaMedal className="text-gray-400 text-xl" />
                      ) : index === 2 ? (
                        <FaMedal className="text-amber-600 text-xl" />
                      ) : (
                        <span className="text-gray-500">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            {/* Fallback avatar if image fails to load */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              {entry.username.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {entry.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white font-bold">
                        {entry.score.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No leaderboard entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 