'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function VerifyRequestPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
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

  // Don't render if user is authenticated (will redirect)
  if (status === 'authenticated') {
    return null;
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
          <div className="text-center">
            <Link 
              href="/login"
              className="inline-flex items-center text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>

            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
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
              {email ? (
                <>We've sent a magic link to <strong className="text-white">{email}</strong>. Click the link in the email to sign in.</>
              ) : (
                <>We've sent you a magic link. Click the link in the email to sign in.</>
              )}
            </p>
            
            <div className="space-y-4">
              <p className="text-white/50 font-dm-sans text-sm">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              
              <Link 
                href="/login"
                className="inline-block text-orange-500 hover:text-orange-400 font-dm-sans text-sm transition-colors"
              >
                Try a different email address
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
