'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaTrophy, FaGamepad, FaEdit, FaCog, FaChartLine, FaMedal, FaStar, FaCalendarAlt, FaCheck, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Sample user data as fallback
  const [userData, setUserData] = useState({
    username: 'GameMaster42',
    email: 'gamemaster@example.com',
    avatarUrl: '/images/avatars/avatar1.jpg',
    bio: 'Competitive gamer with a passion for breaking high scores. I love challenging myself and others to improve.',
    joinDate: '2023-03-15',
    totalGamesPlayed: 247,
    favoriteGame: 'Speed Click',
    achievements: [
      { id: 1, name: 'First Play', description: 'Play your first game', icon: '🎮', date: '2023-03-15', game: 'Speed Click' },
      { id: 2, name: 'High Scorer', description: 'Achieve a high score', icon: '🏆', date: '2023-03-20', game: 'Speed Click' },
      { id: 3, name: 'Dedicated Player', description: 'Play 10 times', icon: '⭐', date: '2023-04-02', game: 'Speed Click' },
      { id: 4, name: 'Speed Demon', description: 'Score over 50 in Speed Click', icon: '⚡', date: '2023-04-10', game: 'Speed Click' },
      { id: 5, name: 'No Laughing Matter', description: 'Last 60 seconds without laughing', icon: '😐', date: '2023-05-05', game: 'You Laugh You Lose' },
      { id: 6, name: 'Roast Survivor', description: 'Get roasted 5 times', icon: '🔥', date: '2023-05-12', game: 'AI Roast Me' },
      { id: 7, name: 'Trend Setter', description: 'Complete all levels in Escape the Viral Trend', icon: '🌊', date: '2023-05-20', game: 'Escape Viral Trend' },
      { id: 8, name: 'Weekly Champion', description: 'Top the weekly leaderboard', icon: '🥇', date: '2023-06-01', game: 'Speed Click' },
    ],
    gameStats: [
      { 
        game: 'Speed Click', 
        icon: '🎮',
        plays: 125, 
        highScore: 87, 
        averageScore: 62, 
        totalTimePlayed: '5h 23m',
        lastPlayed: '2 hours ago',
        rank: 3,
        progress: 85
      },
      { 
        game: 'You Laugh You Lose', 
        icon: '😂',
        plays: 42, 
        highScore: 120, 
        averageScore: 75, 
        totalTimePlayed: '2h 15m',
        lastPlayed: 'Yesterday',
        rank: 12,
        progress: 60
      },
      { 
        game: 'AI Roast Me', 
        icon: '🔥',
        plays: 38, 
        highScore: 95, 
        averageScore: 68, 
        totalTimePlayed: '1h 45m',
        lastPlayed: '3 days ago',
        rank: 25,
        progress: 45
      },
      { 
        game: 'Escape Viral Trend', 
        icon: '🌊',
        plays: 42, 
        highScore: 100, 
        averageScore: 82, 
        totalTimePlayed: '2h 30m',
        lastPlayed: '1 week ago',
        rank: 8,
        progress: 70
      }
    ]
  });

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Redirect to login if not authenticated
          router.push('/login');
          return;
        }
        
        // Get user profile from profiles table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (profile) {
          // Update user data with profile data
          setUserData(prevData => ({
            ...prevData,
            username: profile.username || prevData.username,
            email: session.user.email || prevData.email,
            avatarUrl: profile.avatar_url || prevData.avatarUrl,
            bio: profile.bio || prevData.bio,
            joinDate: profile.created_at || prevData.joinDate,
            favoriteGame: profile.favorite_game || prevData.favoriteGame
          }));
          
          // Update form data
          setFormData({
            username: profile.username || userData.username,
            bio: profile.bio || userData.bio,
            avatarUrl: profile.avatar_url || userData.avatarUrl
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [router, userData.username, userData.bio, userData.avatarUrl]);

  const [formData, setFormData] = useState({
    username: userData.username,
    bio: userData.bio,
    avatarUrl: userData.avatarUrl
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess(false);
    setIsSaving(true);
    
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          bio: formData.bio,
          avatar_url: formData.avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);
        
      if (error) {
        throw error;
      }
      
      // Update local user data
      setUserData(prev => ({
        ...prev,
        username: formData.username,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl
      }));
      
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setSaveError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Profile header */}
          <div className="p-6 text-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <FaSpinner className="animate-spin text-3xl text-blue-500 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
              </div>
            ) : (
              <>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {userData.avatarUrl ? (
                      <Image 
                        src={userData.avatarUrl} 
                        alt={userData.username} 
                        width={96} 
                        height={96} 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          // Fallback to initial if image fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null}
                    {/* Fallback avatar */}
                    <div className="absolute inset-0 flex items-center justify-center text-3xl text-gray-500 dark:text-gray-400">
                      {userData.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold">{userData.username}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Joined {new Date(userData.joinDate).toLocaleDateString()}
                </p>
              </>
            )}
          </div>
          
          {/* Navigation tabs */}
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${
                    activeTab === 'overview'
                      ? 'bg-primary/10 text-primary'
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
                      ? 'bg-primary/10 text-primary'
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
                      ? 'bg-primary/10 text-primary'
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
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaCog className="mr-3" /> Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:col-span-3">
        {/* Overview tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Profile Overview</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-primary hover:text-primary-hover"
                  >
                    <FaEdit className="mr-1" /> {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                    
                    {saveError && (
                      <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                        {saveError}
                      </div>
                    )}
                    
                    {saveSuccess && (
                      <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center">
                        <FaCheck className="mr-2" /> Profile updated successfully!
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="username" className="block mb-1 font-medium">Username</label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="avatarUrl" className="block mb-1 font-medium">Avatar URL</label>
                        <input
                          type="text"
                          id="avatarUrl"
                          name="avatarUrl"
                          value={formData.avatarUrl}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/avatar.jpg"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block mb-1 font-medium">Bio</label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Tell us about yourself..."
                        ></textarea>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isSaving ? (
                            <>
                              <FaSpinner className="animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {userData.bio}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaGamepad className="text-primary mr-2" />
                          <h3 className="font-bold">Total Games Played</h3>
                        </div>
                        <p className="text-2xl font-bold">{userData.totalGamesPlayed}</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaStar className="text-yellow-500 mr-2" />
                          <h3 className="font-bold">Favorite Game</h3>
                        </div>
                        <p className="text-2xl font-bold">{userData.favoriteGame}</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaTrophy className="text-amber-500 mr-2" />
                          <h3 className="font-bold">Achievements</h3>
                        </div>
                        <p className="text-2xl font-bold">{userData.achievements.length}</p>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          <h3 className="font-bold">Member Since</h3>
                        </div>
                        <p className="text-lg font-bold">{new Date(userData.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Recent Achievements</h2>
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className="text-primary hover:text-primary-hover"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {userData.achievements.slice(0, 3).map(achievement => (
                    <div key={achievement.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-xl mr-4">
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="font-bold">{achievement.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {achievement.description} • {achievement.game}
                        </p>
                      </div>
                      <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Achievements tab */}
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Your Achievements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.achievements.map(achievement => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full text-2xl mr-4">
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-bold">{achievement.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                          {achievement.game}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Stats tab */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Game Statistics</h2>
              
              <div className="space-y-8">
                {userData.gameStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-xl mr-3">
                        {stat.icon}
                      </div>
                      <h3 className="text-xl font-bold">{stat.game}</h3>
                      <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        Last played: {stat.lastPlayed}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Plays</div>
                        <div className="text-xl font-bold">{stat.plays}</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">High Score</div>
                        <div className="text-xl font-bold">{stat.highScore}</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg Score</div>
                        <div className="text-xl font-bold">{stat.averageScore}</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rank</div>
                        <div className="text-xl font-bold flex items-center">
                          #{stat.rank} <FaMedal className="ml-1 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-2 flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{stat.progress}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${stat.progress}%` }}
                      ></div>
                    </div>
                    
                    {index < userData.gameStats.length - 1 && (
                      <hr className="my-6 border-gray-200 dark:border-gray-700" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notif-achievements"
                        defaultChecked
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="notif-achievements" className="ml-2">
                        Achievement notifications
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notif-leaderboard"
                        defaultChecked
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="notif-leaderboard" className="ml-2">
                        Leaderboard updates
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notif-games"
                        defaultChecked
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="notif-games" className="ml-2">
                        New game announcements
                      </label>
                    </div>
                  </div>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                <div>
                  <h3 className="text-lg font-bold mb-4">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="privacy-profile"
                        defaultChecked
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="privacy-profile" className="ml-2">
                        Show my profile to other players
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="privacy-stats"
                        defaultChecked
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="privacy-stats" className="ml-2">
                        Show my game statistics on leaderboards
                      </label>
                    </div>
                  </div>
                </div>
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                <div>
                  <h3 className="text-lg font-bold mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                      Change Password
                    </button>
                    
                    <button className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg flex items-center">
                    <FaCheck className="mr-2" /> Save Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 