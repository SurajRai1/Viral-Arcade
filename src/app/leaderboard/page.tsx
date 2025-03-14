'use client';

import { useState } from 'react';
import Link from 'next/link';
import Leaderboard from '@/components/Leaderboard';

export default function LeaderboardPage() {
  const [activeMode, setActiveMode] = useState<'standard' | 'rage'>('standard');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">SpeedTap Arena</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:underline font-bold">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:underline">
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Global Leaderboard</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See who has the fastest fingers in the world! Can you beat these scores?
          </p>
        </section>

        <section className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium rounded-l-lg ${
                    activeMode === 'standard'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveMode('standard')}
                >
                  Standard Mode
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 text-sm font-medium rounded-r-lg ${
                    activeMode === 'rage'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveMode('rage')}
                >
                  Rage Mode
                </button>
              </div>
            </div>

            <Leaderboard isRageMode={activeMode === 'rage'} limit={20} />
          </div>
        </section>

        <section className="text-center">
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-green-500 text-white rounded-full text-lg font-bold hover:bg-green-600"
          >
            Play Now
          </Link>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} SpeedTap Arena</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <Link href="/leaderboard" className="hover:underline">
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 