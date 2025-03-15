'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaGamepad, FaUser, FaBars, FaTimes, FaInfoCircle, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    
    checkUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: <FaGamepad /> },
    { name: 'Games', href: '/games', icon: <FaGamepad /> },
    { name: 'How to Play', href: '/how-to-play', icon: <FaInfoCircle /> },
    { name: 'Contact', href: '/contact', icon: <FaEnvelope /> },
  ];

  const authLinks = user ? [
    { name: 'Dashboard', href: '/dashboard', icon: <FaGamepad /> },
    { name: 'Profile', href: '/dashboard/profile', icon: <FaUser /> },
  ] : [];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'nav-scrolled py-2 shadow-lg' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${isScrolled ? 'text-white' : 'gradient-text-secondary'}`}>
              SpeedTap Arena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-1 transition-colors ${
                  pathname === link.href
                    ? 'text-secondary font-medium'
                    : isScrolled 
                      ? 'text-white hover:text-secondary'
                      : 'text-neutral-800 dark:text-neutral-200 hover:text-secondary'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}

            {user ? (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-1 transition-colors ${
                      pathname === link.href
                        ? 'text-secondary font-medium'
                        : isScrolled 
                          ? 'text-white hover:text-secondary'
                          : 'text-neutral-800 dark:text-neutral-200 hover:text-secondary'
                    }`}
                  >
                    <span>{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                ))}
                <button
                  onClick={handleSignOut}
                  className="btn-secondary px-4 py-2 rounded-full text-white font-medium hover:opacity-90 transition-opacity flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="btn-secondary px-4 py-2 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden focus:outline-none ${isScrolled ? 'text-white' : 'text-primary dark:text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden mobile-nav-menu mt-2 px-4 py-5"
        >
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors mobile-nav-link ${
                  pathname === link.href
                    ? 'bg-secondary/20 text-secondary font-bold'
                    : 'text-neutral-900 hover:bg-secondary/10 hover:text-secondary'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-lg font-semibold">{link.name}</span>
              </Link>
            ))}

            {user ? (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors mobile-nav-link ${
                      pathname === link.href
                        ? 'bg-secondary/20 text-secondary font-bold'
                        : 'text-neutral-900 hover:bg-secondary/10 hover:text-secondary'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-lg font-semibold">{link.name}</span>
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex justify-center p-3 rounded-lg btn-secondary text-white font-bold text-lg hover:opacity-90 transition-opacity"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex justify-center p-3 rounded-lg btn-secondary text-white font-bold text-lg hover:opacity-90 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
} 