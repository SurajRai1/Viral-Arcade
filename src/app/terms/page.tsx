'use client';

import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

export default function TermsPage() {
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
              Terms of Service
            </h1>
            
            <div className="w-8"></div> {/* Empty div for flex spacing */}
          </div>
          
          {/* Terms content */}
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
                
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using SpeedTap Arena, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                </p>
                
                <h2>2. Description of Service</h2>
                <p>
                  SpeedTap Arena provides interactive games and entertainment content. We offer both free and premium features, with some features requiring account creation.
                </p>
                
                <h2>3. User Accounts</h2>
                <p>
                  Some features of SpeedTap Arena require you to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                </p>
                <p>
                  You agree to provide accurate and complete information when creating an account and to update your information to keep it accurate and current.
                </p>
                
                <h2>4. User Content</h2>
                <p>
                  Some of our games may allow you to upload, submit, or transmit content such as photos or text. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content.
                </p>
                <p>
                  You represent and warrant that you own or have the necessary rights to the content you submit, and that the content does not violate the rights of any third party.
                </p>
                
                <h2>5. Privacy</h2>
                <p>
                  Your privacy is important to us. Please review our <Link href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">Privacy Policy</Link> to understand how we collect, use, and disclose information about you.
                </p>
                
                <h2>6. Prohibited Conduct</h2>
                <p>
                  You agree not to:
                </p>
                <ul>
                  <li>Use the service for any illegal purpose or in violation of any laws</li>
                  <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                  <li>Attempt to gain unauthorized access to any part of the service</li>
                  <li>Interfere with or disrupt the service or servers or networks connected to the service</li>
                  <li>Use any robot, spider, or other automated device to access the service</li>
                </ul>
                
                <h2>7. Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
                </p>
                
                <h2>8. Disclaimer of Warranties</h2>
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
                
                <h2>9. Limitation of Liability</h2>
                <p>
                  IN NO EVENT SHALL SPEEDTAP ARENA BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
                </p>
                
                <h2>10. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms of Service at any time. We will provide notice of significant changes by posting the new Terms of Service on this page and updating the "Last Updated" date.
                </p>
                
                <h2>11. Contact Us</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at support@speedtaparena.com.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
} 