'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaEnvelope, FaArrowLeft, FaHome, FaSpinner } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

// Create a separate component that uses useSearchParams
function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Get email from URL parameters
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);
  
  const handleResendEmail = async () => {
    if (!email.trim()) {
      setResendError('Please enter your email address');
      return;
    }
    
    setIsResending(true);
    setResendError(null);
    
    try {
      // Call Supabase to resend the verification email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      setResendSuccess(true);
      
      // Reset the success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (error: Error | unknown) {
      console.error('Error resending verification email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email';
      setResendError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {/* Header with back button */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back to Home
            </Link>
            
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Verify Email
            </h1>
            
            <div className="w-8"></div> {/* Empty div for flex spacing */}
          </div>
          
          {/* Confirmation content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaEnvelope className="w-10 h-10 text-blue-500" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Check Your Email</h2>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
                <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">What happens next?</h3>
                <ol className="text-left text-gray-600 dark:text-gray-400 list-decimal pl-5 space-y-2">
                  <li>Click the verification link in your email</li>
                  <li>You'll be redirected to the login page</li>
                  <li>Log in with your email and password</li>
                  <li>Start exploring SpeedTap Arena!</li>
                </ol>
              </div>
              
              <div className="flex flex-col space-y-4">
                {resendSuccess && (
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                    Verification email resent successfully!
                  </div>
                )}
                
                {resendError && (
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                    {resendError}
                  </div>
                )}
                
                <div className="flex flex-col space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none border-blue-300 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-200 bg-white dark:bg-gray-700"
                  />
                  
                  <button
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="w-full py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resending...
                      </span>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                </div>
                
                <Link
                  href="/login"
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-center"
                >
                  Go to Login
                </Link>
                
                <Link
                  href="/"
                  className="flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <FaHome className="mr-2" /> Return to Homepage
                </Link>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              If you don't see the email, please check your spam folder or contact our support team.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Loading fallback component
function ConfirmationLoading() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center items-center mb-8">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
              Verify Email
            </h1>
          </div>
          
          <div className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex flex-col items-center">
                <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Loading</h2>
                <p className="text-gray-600 dark:text-gray-400">Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Main component that wraps the content in a Suspense boundary
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <ConfirmationContent />
    </Suspense>
  );
}
