
import React, { useEffect, useState } from 'react';
import { useLocation, Navigate, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import AuthCard from '@/components/auth/AuthCard';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  
  // If we're at /auth, redirect to /login
  if (location.pathname === '/auth') {
    return <Navigate to="/login" replace />;
  }
  
  // Placeholder authentication check logic
  const isAuthenticated = false;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden"
    >
      {/* Background gradient and effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-200 to-dark -z-10">
        {/* Animated gradient orbs for background effect */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-brand/5 blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-brand-light/5 blur-3xl opacity-30 animate-float animate-delay-500"></div>
      </div>
      
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGZpbHRlciBpZD0ibm9pc2UiPgogICAgPGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNzUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIG51bU9jdGF2ZXM9IjIiIHNlZWQ9IjAiIHJlc3VsdD0idHVyYnVsZW5jZSIgLz4KICAgIDxmZUNvbG9yTWF0cml4IHR5cGU9InNhdHVyYXRlIiB2YWx1ZXM9IjAiIC8+CiAgPC9maWx0ZXI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30 mix-blend-soft-light pointer-events-none -z-10"></div>
      
      {/* Brand logo moved to top right with link and slogan */}
      <div className="absolute top-8 right-8 z-50">
        <Link to="/">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Placeholder for logo - increased size by 1.75x */}
            <div className="flex items-center space-x-3">
              <div className="w-[17.5px] h-[17.5px] bg-brand rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-[1.75rem]">S</span>
              </div>
              <h1 className="text-[1.75rem] font-semibold text-white">SubSpace</h1>
            </div>
            {/* Added slogan */}
            <p className="text-xs text-white/60 mt-1 font-light tracking-wider">Engineered for Dominance</p>
          </motion.div>
        </Link>
      </div>

      {/* Auth card container - will animate between login/register */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isLoginPage ? 'login' : 'register'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          {isLoginPage && (
            <AuthCard 
              title="Welcome back" 
              subtitle="Sign in to your account to continue"
            >
              <LoginForm />
            </AuthCard>
          )}
          
          {isRegisterPage && (
            <AuthCard 
              title="Create your account" 
              subtitle="Join SubSpace to experience the platform"
            >
              <RegisterForm />
            </AuthCard>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Footer area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute bottom-6 left-0 right-0 text-center text-white/40 text-xs"
      >
        © {new Date().getFullYear()} SubSpace. All rights reserved.
      </motion.div>
    </motion.div>
  );
};

export default Auth;
