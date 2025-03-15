'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaGamepad } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Get the referrer game from URL query params
  const [referrerGame, setReferrerGame] = useState<string | null>(null);
  
  // Use useEffect to ensure this code only runs on the client side
  useEffect(() => {
    // This is a mock implementation - in a real app we would use router.query
    const urlParams = new URLSearchParams(window.location.search);
    const game = urlParams.get('from');
    setReferrerGame(game);
    
    // Get email from URL if it exists (redirected from login page)
    const email = urlParams.get('email');
    if (email) {
      setFormData(prev => ({
        ...prev,
        email
      }));
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Sign up with Supabase
      // We don't use the data directly as we redirect to confirmation page
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Show success message
      setSignupSuccess(true);
      
      // Redirect to the email confirmation page after a delay
      setTimeout(() => {
        router.push(`/signup/confirmation?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
      
    } catch (error: Error | unknown) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during signup. Please try again.';
      setErrors(prev => ({
        ...prev,
        form: errorMessage
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google sign up
  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: Error | unknown) {
      console.error('Google sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up with Google. Please try again.';
      setErrors(prev => ({
        ...prev,
        form: errorMessage
      }));
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
              Create Account
            </h1>
            
            <div className="w-8"></div> {/* Empty div for flex spacing */}
          </div>
          
          {/* Signup form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            {!signupSuccess ? (
              <form onSubmit={handleSubmit} className="p-8">
                {referrerGame && (
                  <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-blue-700 dark:text-blue-300 flex items-center">
                      <FaGamepad className="mr-2" />
                      <span>
                        <span className="font-bold">Continue from {referrerGame?.replace(/-/g, ' ')}</span>
                        <span className="block text-sm mt-1">
                          Create an account to unlock unlimited gameplay and save your progress!
                        </span>
                      </span>
                    </p>
                  </div>
                )}
                
                {errors.form && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-600 dark:text-red-400">{errors.form}</p>
                  </div>
                )}
                
                {/* Name field */}
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none ${
                        errors.name
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/10'
                          : 'border-blue-300 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-200 bg-white dark:bg-gray-700'
                      }`}
                      placeholder="Enter your name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>
                
                {/* Email field */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/10'
                          : 'border-blue-300 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-200 bg-white dark:bg-gray-700'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>
                
                {/* Password field */}
                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none ${
                        errors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/10'
                          : 'border-blue-300 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-200 bg-white dark:bg-gray-700'
                      }`}
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  ) : (
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>
                
                {/* Confirm Password field */}
                <div className="mb-8">
                  <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none ${
                        errors.confirmPassword
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/10'
                          : 'border-blue-300 dark:border-blue-600 focus:border-blue-500 focus:ring-blue-200 bg-white dark:bg-gray-700'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
                
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
                
                {/* Login link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Account Created!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your account has been successfully created. You'll be redirected shortly...
                </p>
                <div className="flex justify-center">
                  <div className="w-12 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Privacy notice */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline dark:text-blue-400">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
                Privacy Policy
              </Link>
            </p>
          </div>

          {/* Alternative signup methods */}
          {!signupSuccess && (
            <div className="mt-8">
              <div className="relative flex items-center justify-center">
                <div className="absolute border-t border-gray-300 dark:border-gray-600 w-full"></div>
                <div className="relative bg-white dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400">
                  Or sign up with
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 