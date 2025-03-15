'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FaSpinner } from 'react-icons/fa';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Processing your authentication...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the token and type from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        
        // Check if this is a redirect from OAuth (Google, etc.)
        const code = searchParams.get('code');
        const provider = searchParams.get('provider');
        
        if (code) {
          // This is an OAuth callback
          setMessage(`Completing ${provider || 'social'} login...`);
          
          // The session will be automatically set by Supabase Auth
          // We just need to redirect to the dashboard
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
          return;
        }
        
        if (type === 'email_confirmation' && token) {
          // Process the email confirmation
          setMessage('Confirming your email...');
          
          // Exchange the token
          const { error } = await supabase.auth.exchangeCodeForSession(token);
          
          if (error) {
            throw error;
          }
          
          // Set a success message in localStorage to display on the login page
          localStorage.setItem('emailConfirmed', 'true');
          
          // Redirect to login page
          setMessage('Email confirmed! Redirecting to login...');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else if (type === 'recovery' && token) {
          // Handle password reset
          setMessage('Processing your password reset...');
          
          // Redirect to password reset page with token
          router.push(`/reset-password?token=${token}`);
        } else {
          // Check if we have a session already
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            // User is logged in, redirect to dashboard
            setMessage('Authentication successful! Redirecting to dashboard...');
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
          } else {
            // No valid parameters and no session, redirect to login
            router.push('/login');
          }
        }
      } catch (error: Error | unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred during authentication';
        console.error('Error processing authentication callback:', error);
        setError(errorMessage);
        
        // Redirect to login after a delay even if there's an error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        {error ? (
          <div className="text-red-600 dark:text-red-400 mb-4">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">Please Wait</h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
} 