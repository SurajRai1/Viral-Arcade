'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaGamepad, FaCalendarAlt } from 'react-icons/fa';

// Define types for leaderboard entries and game IDs
type LeaderboardEntry = {
  id: number;
  username: string;
  score: number;
  date: string;
};

// Define valid game IDs as a type
type GameId = 'meme-quiz' | 'ai-roast-me' | 'would-you-rather' | 'lie-detector';

// Sample leaderboard data
const leaderboardData: Record<GameId, LeaderboardEntry[]> = {
  'meme-quiz': [
    { id: 1, username: 'MemeKing', score: 9850, date: '2023-06-15' },
    { id: 2, username: 'DankMaster', score: 9720, date: '2023-06-18' },
    { id: 3, username: 'MemeQueen', score: 9650, date: '2023-06-12' },
    { id: 4, username: 'ViralVicky', score: 9500, date: '2023-06-20' },
    { id: 5, username: 'LaughLord', score: 9350, date: '2023-06-17' },
    { id: 6, username: 'JokesterJim', score: 9200, date: '2023-06-19' },
    { id: 7, username: 'HumorHero', score: 9100, date: '2023-06-14' },
    { id: 8, username: 'GiggleGuru', score: 9050, date: '2023-06-16' },
    { id: 9, username: 'LolMaster', score: 8950, date: '2023-06-13' },
    { id: 10, username: 'FunnyFred', score: 8900, date: '2023-06-11' },
  ],
  'ai-roast-me': [
    { id: 1, username: 'RoastMaster', score: 9950, date: '2023-06-14' },
    { id: 2, username: 'BurnVictim', score: 9800, date: '2023-06-17' },
    { id: 3, username: 'CritiqueKing', score: 9750, date: '2023-06-19' },
    { id: 4, username: 'SavageQueen', score: 9600, date: '2023-06-15' },
    { id: 5, username: 'RoastBeef', score: 9550, date: '2023-06-18' },
    { id: 6, username: 'BurnNotice', score: 9400, date: '2023-06-16' },
    { id: 7, username: 'FlameOn', score: 9350, date: '2023-06-20' },
    { id: 8, username: 'SizzleMaster', score: 9300, date: '2023-06-13' },
    { id: 9, username: 'HeatWave', score: 9250, date: '2023-06-12' },
    { id: 10, username: 'BurnUnit', score: 9200, date: '2023-06-11' },
  ],
  'would-you-rather': [
    { id: 1, username: 'ChoiceMaster', score: 9900, date: '2023-06-16' },
    { id: 2, username: 'DilemmaKing', score: 9850, date: '2023-06-19' },
    { id: 3, username: 'DecisionMaker', score: 9800, date: '2023-06-15' },
    { id: 4, username: 'OptionQueen', score: 9750, date: '2023-06-18' },
    { id: 5, username: 'PickerPro', score: 9700, date: '2023-06-17' },
    { id: 6, username: 'EitherOr', score: 9650, date: '2023-06-20' },
    { id: 7, username: 'ChooseWisely', score: 9600, date: '2023-06-14' },
    { id: 8, username: 'DeciderDan', score: 9550, date: '2023-06-13' },
    { id: 9, username: 'SelectionSam', score: 9500, date: '2023-06-12' },
    { id: 10, username: 'OptionOliver', score: 9450, date: '2023-06-11' },
  ],
  'lie-detector': [
    { id: 1, username: 'TruthSeeker', score: 9800, date: '2023-06-17' },
    { id: 2, username: 'HonestAbe', score: 9750, date: '2023-06-15' },
    { id: 3, username: 'LieSpotter', score: 9700, date: '2023-06-19' },
    { id: 4, username: 'DetectorPro', score: 9650, date: '2023-06-16' },
    { id: 5, username: 'TruthTeller', score: 9600, date: '2023-06-18' },
    { id: 6, username: 'FibFinder', score: 9550, date: '2023-06-14' },
    { id: 7, username: 'DeceptionDiva', score: 9500, date: '2023-06-20' },
    { id: 8, username: 'HonestyHero', score: 9450, date: '2023-06-13' },
    { id: 9, username: 'TruthTracker', score: 9400, date: '2023-06-12' },
    { id: 10, username: 'LieLocator', score: 9350, date: '2023-06-11' },
  ],
};

const games = [
  { id: 'meme-quiz' as GameId, name: 'Meme Quiz', color: 'bg-blue-600' },
  { id: 'ai-roast-me' as GameId, name: 'AI Roast Me', color: 'bg-red-600' },
  { id: 'would-you-rather' as GameId, name: 'Would You Rather?', color: 'bg-purple-600' },
  { id: 'lie-detector' as GameId, name: 'Lie Detector', color: 'bg-green-600' },
];

export default function LeaderboardsPage() {
  const [selectedGame, setSelectedGame] = useState<GameId>('meme-quiz');
  const [timeframe, setTimeframe] = useState('all-time');

  // Get the current leaderboard based on selected game
  const currentLeaderboard = leaderboardData[selectedGame] || [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Leaderboards</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See who's topping the charts in our viral games. Can you claim a spot among the best?
          </p>
        </motion.div>

        {/* Game selector */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`px-4 py-2 rounded-full flex items-center ${
                  selectedGame === game.id
                    ? `${game.color} text-white`
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
              >
                <FaGamepad className="mr-2" /> {game.name}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
            <button
              onClick={() => setTimeframe('all-time')}
              className={`px-4 py-2 rounded-lg ${
                timeframe === 'all-time'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-4 py-2 rounded-lg ${
                timeframe === 'weekly'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-4 py-2 rounded-lg ${
                timeframe === 'daily'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Today
            </button>
          </div>
        </div>

        {/* Leaderboard table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold">
              {games.find((g) => g.id === selectedGame)?.name} Leaderboard
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
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
                {currentLeaderboard.map((entry, index) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={index < 3 ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index === 0 ? (
                          <FaTrophy className="text-yellow-500 mr-2" />
                        ) : index === 1 ? (
                          <FaMedal className="text-gray-400 mr-2" />
                        ) : index === 2 ? (
                          <FaMedal className="text-amber-700 mr-2" />
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400 font-medium w-6 text-center">
                            {index + 1}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {entry.score.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <FaCalendarAlt className="mr-2" />
                        {entry.date}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 