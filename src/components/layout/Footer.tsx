'use client';

import Link from 'next/link';
import { FaTwitter, FaInstagram, FaTiktok, FaDiscord, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Games',
      links: [
        { name: 'Meme Quiz', href: '/games/meme-quiz' },
        { name: 'AI Roast Me', href: '/games/ai-roast-me' },
        { name: 'Would You Rather?', href: '/games/would-you-rather' },
        { name: 'Lie Detector', href: '/games/lie-detector' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Twitter', icon: <FaTwitter size={20} />, href: 'https://twitter.com' },
    { name: 'Instagram', icon: <FaInstagram size={20} />, href: 'https://instagram.com' },
    { name: 'TikTok', icon: <FaTiktok size={20} />, href: 'https://tiktok.com' },
    { name: 'Discord', icon: <FaDiscord size={20} />, href: 'https://discord.com' },
  ];

  return (
    <footer className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">ViralArcade</span>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              ViralArcade is an innovative web-based gaming platform that hosts multiple viral and engaging games within a single web application.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            &copy; {currentYear} ViralArcade. All rights reserved.
          </p>
          <p className="text-gray-300 text-sm flex items-center">
            Made with <FaHeart className="text-pink-500 mx-1" /> by the ViralArcade Team
          </p>
        </div>
      </div>
    </footer>
  );
} 