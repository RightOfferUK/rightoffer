'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string>('');
  const [userStatus, setUserStatus] = useState<'active' | 'inactive' | 'not_found' | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/dashboard');
    }
  }, [session, status, router]);

  // Show loading while checking authentication status
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center px-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-dm-sans">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render login form if user is authenticated (will redirect)
  if (status === 'authenticated') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');
    setUserStatus(null);

    try {
      // First, check user status
      const statusResponse = await fetch('/api/auth/check-user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const statusData = await statusResponse.json();

      if (statusData.status === 'inactive') {
        setUserStatus('inactive');
        setError(statusData.message);
        return;
      }

      if (statusData.status === 'not_found') {
        setUserStatus('not_found');
        setError(statusData.message);
        return;
      }

      // If user is active, proceed with sign in
      if (statusData.status === 'active') {
        await signIn('resend', { 
          email, 
          redirect: false,
          callbackUrl: '/dashboard' 
        });
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center px-4">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-bold font-dm-sans text-white mb-4">
                Check your email
              </h1>
              
              <p className="text-white/70 font-dm-sans mb-6">
                We've sent a magic link to <strong className="text-white">{email}</strong>. 
                Click the link in the email to sign in.
              </p>
              
              <motion.button
                onClick={() => setIsSubmitted(false)}
                className="text-purple-500 hover:text-purple-400 font-dm-sans text-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Use a different email address
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex items-center justify-center px-4">
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
            
            <h1 className="text-3xl font-bold font-dm-sans text-white mb-2">
              Welcome back
            </h1>
            <p className="text-white/70 font-dm-sans">
              Sign in to your RightOffer account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border flex items-start gap-3 ${
                  userStatus === 'inactive' 
                    ? 'bg-amber-500/20 border-amber-500/30' 
                    : 'bg-red-500/20 border-red-500/30'
                }`}
              >
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  userStatus === 'inactive' ? 'text-amber-400' : 'text-red-400'
                }`} />
                <div>
                  <h3 className={`font-semibold font-dm-sans mb-1 ${
                    userStatus === 'inactive' ? 'text-amber-300' : 'text-red-300'
                  }`}>
                    {userStatus === 'inactive' ? 'Account Inactive' : 'Sign In Error'}
                  </h3>
                  <p className={`text-sm ${
                    userStatus === 'inactive' ? 'text-amber-200/80' : 'text-red-200/80'
                  }`}>
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium font-dm-sans text-white mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) {
                    setError('');
                    setUserStatus(null);
                  }
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 font-dm-sans focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !email}
              className="w-full btn-primary-gradient px-6 py-3 rounded-lg font-dm-sans font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Sending magic link...
                </div>
              ) : (
                'Send magic link'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 font-dm-sans text-sm">
              Only authorized users can access this system. Contact your administrator if you need access.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
