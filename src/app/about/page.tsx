import Link from 'next/link';

export default function AboutPage() {
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
                  <Link href="/leaderboard" className="hover:underline">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:underline font-bold">
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">About SpeedTap Arena</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The ultimate test of speed in just one second!
          </p>
        </section>

        <section className="mb-12 max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">The Concept</h3>
            <p className="mb-6 text-gray-700">
              SpeedTap Arena was born from a simple question: How many times can someone tap in just one second? 
              This ultra-short gameplay creates an intense, adrenaline-fueled experience that's perfect for quick 
              gaming sessions and friendly competition.
            </p>
            
            <h3 className="text-2xl font-bold mb-4">Game Modes</h3>
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-2">Standard Mode</h4>
              <p className="text-gray-700 mb-4">
                The classic experience. You have exactly one second to tap or click as many times as possible.
                No distractions, no obstacles - just pure speed.
              </p>
              
              <h4 className="text-xl font-semibold mb-2">Rage Mode</h4>
              <p className="text-gray-700">
                For those seeking an extra challenge. In Rage Mode, red obstacles appear randomly on the screen.
                If you accidentally tap on one, you'll lose a point! This mode tests both your speed and precision.
              </p>
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Technical Details</h3>
            <p className="mb-6 text-gray-700">
              SpeedTap Arena is built with modern web technologies:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li><span className="font-semibold">Next.js:</span> For fast performance and easy deployment</li>
              <li><span className="font-semibold">React:</span> For responsive, component-based UI</li>
              <li><span className="font-semibold">Tailwind CSS:</span> For clean, modern styling</li>
              <li><span className="font-semibold">Supabase:</span> For backend database and leaderboard functionality</li>
            </ul>
            
            <h3 className="text-2xl font-bold mb-4">Future Plans</h3>
            <p className="text-gray-700">
              We're constantly working to improve SpeedTap Arena. Some features we're planning to add include:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>User accounts and profiles</li>
              <li>Additional game modes</li>
              <li>Achievements and badges</li>
              <li>Mobile app versions</li>
              <li>Multiplayer challenges</li>
            </ul>
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