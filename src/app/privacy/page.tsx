'use client';

import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCamera, FaImage, FaUserAlt, FaGamepad, FaServer } from 'react-icons/fa';

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Privacy Policy
            </h1>
            
            <div className="w-8"></div> {/* Empty div for flex spacing */}
          </div>
          
          {/* Privacy content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <div className="prose prose-blue max-w-none dark:prose-invert">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Last Updated: {new Date().toLocaleDateString()}
                </p>
                
                <p className="lead text-lg">
                  At SpeedTap Arena, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
                </p>
                
                <h2 className="flex items-center">
                  <FaUserAlt className="mr-2 text-blue-500" /> Information We Collect
                </h2>
                <p>
                  We collect the following types of information:
                </p>
                <ul>
                  <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
                  <li><strong>Usage Data:</strong> We collect information about how you interact with our platform, including game scores, achievements, and preferences.</li>
                  <li><strong>Device Information:</strong> We collect information about the device you use to access our platform, including device type, operating system, and browser type.</li>
                </ul>
                
                <h2 className="flex items-center">
                  <FaCamera className="mr-2 text-blue-500" /> Webcam Access and Usage
                </h2>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-4">
                  <p className="mb-2">
                    <strong>Important:</strong> Some of our games, such as "You Laugh You Lose," require access to your device's webcam to function properly.
                  </p>
                  <ul>
                    <li>We will always ask for your explicit permission before accessing your webcam.</li>
                    <li>Webcam data is processed locally on your device and is not transmitted to our servers unless you have an account.</li>
                    <li>For users without accounts, no webcam data or images are stored beyond the current game session.</li>
                    <li>For users with accounts, limited webcam data may be temporarily stored to enable features like score tracking and achievements.</li>
                  </ul>
                </div>
                
                <h2 className="flex items-center">
                  <FaImage className="mr-2 text-blue-500" /> Photo and Image Handling
                </h2>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700 mb-4">
                  <p className="mb-2">
                    <strong>Important:</strong> Some of our games, such as "AI Roast Me," allow you to upload photos or images.
                  </p>
                  <ul>
                    <li>For users without accounts, uploaded images are processed locally in your browser and are not stored on our servers.</li>
                    <li>For users with accounts, uploaded images may be stored securely on our servers to enable features like saving your game progress.</li>
                    <li>We do not use your images for any purpose other than providing the game functionality you requested.</li>
                    <li>You can request deletion of your images at any time through your account settings.</li>
                  </ul>
                </div>
                
                <h2 className="flex items-center">
                  <FaGamepad className="mr-2 text-blue-500" /> How We Use Your Information
                </h2>
                <p>
                  We use your information to:
                </p>
                <ul>
                  <li>Provide, maintain, and improve our platform</li>
                  <li>Process and complete transactions</li>
                  <li>Send you technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Develop new products and services</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our platform</li>
                </ul>
                
                <h2 className="flex items-center">
                  <FaServer className="mr-2 text-blue-500" /> Data Storage and Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
                </p>
                <p>
                  For users without accounts:
                </p>
                <ul>
                  <li>Game data is stored locally in your browser's storage</li>
                  <li>No personal information is transmitted to our servers</li>
                  <li>Webcam data and uploaded images are processed locally and not stored</li>
                </ul>
                <p>
                  For users with accounts:
                </p>
                <ul>
                  <li>Your account information is stored securely on our servers</li>
                  <li>Game data, including scores and achievements, is stored with your account</li>
                  <li>Any uploaded content is stored securely and associated with your account</li>
                </ul>
                
                <h2>Cookies and Similar Technologies</h2>
                <p>
                  We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our platform. This helps us provide you with a good experience when you browse our platform and allows us to improve our service.
                </p>
                
                <h2>Your Rights</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul>
                  <li>The right to access your personal information</li>
                  <li>The right to rectify inaccurate personal information</li>
                  <li>The right to erase your personal information</li>
                  <li>The right to restrict processing of your personal information</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing of your personal information</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at privacy@speedtaparena.com.
                </p>
                
                <h2>Children's Privacy</h2>
                <p>
                  Our platform is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn that we have collected personal information from a child under 13, we will take steps to delete that information.
                </p>
                
                <h2>Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                
                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at privacy@speedtaparena.com.
                </p>
                
                <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    By using SpeedTap Arena, you agree to the collection and use of information in accordance with this Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
} 