'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGamepad, FaUserPlus } from 'react-icons/fa';

export default function CtaSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-pink-600/90 z-0" />
      
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-white max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Join the Fun?</h2>
          <p className="text-xl text-white/90 mb-10">
            Start playing our viral games today, challenge your friends, and climb the leaderboards!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/games"
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <FaGamepad className="mr-2" /> Play Now
            </Link>
            
            <Link
              href="/signup"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <FaUserPlus className="mr-2" /> Create Account
            </Link>
          </div>
          
          <p className="mt-6 text-white/80 text-sm">
            No sign-up required to play. Create an account to save progress and compete on leaderboards.
          </p>
        </motion.div>
      </div>
    </section>
  );
} 