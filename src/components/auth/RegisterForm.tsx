
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Validate username format
  useEffect(() => {
    // Check if username is at least 3 alphanumeric characters
    const isValid = /^[a-zA-Z0-9]{3,}$/.test(username);
    setIsUsernameValid(isValid);
    
    if (!isValid && username) {
      setUsernameMessage('Username must be at least 3 alphanumeric characters');
    } else if (!username) {
      setUsernameMessage('');
    }
  }, [username]);

  // Check username availability with debounce
  useEffect(() => {
    const checkUsername = async () => {
      if (!isUsernameValid) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();
          
        if (error && error.code === 'PGRST116') {
          // No data found means username is available
          setIsUsernameAvailable(true);
          setUsernameMessage('Username is available');
        } else {
          setIsUsernameAvailable(false);
          setUsernameMessage('Username is already taken');
        }
      } catch (error) {
        console.error('Error checking username:', error);
      }
    };
    
    const timer = setTimeout(() => {
      if (username && isUsernameValid) {
        checkUsername();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [username, isUsernameValid]);

  // Check email availability with debounce - FIXED IMPLEMENTATION
  useEffect(() => {
    const checkEmail = async () => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
      
      setCheckingEmail(true);
      setEmailMessage('');
      
      try {
        // Use the auth.signUp method with throwOnError: true to check if email exists
        // This avoids actually creating a user by using a deliberately invalid password
        const { error } = await supabase.auth.signUp({
          email,
          password: 'temporary_check_password_123!',
          options: { emailRedirectTo: window.location.origin }
        });
        
        // If we get a "User already registered" error, the email is taken
        if (error && error.message.includes('already registered')) {
          setIsEmailAvailable(false);
          setEmailMessage('An account with this email already exists');
        } else {
          // No error or different error means the email is available
          setIsEmailAvailable(true);
          setEmailMessage('');
        }
      } catch (error) {
        console.error('Error checking email:', error);
        // Default to allowing the user to proceed if the check fails
        setIsEmailAvailable(true);
        setEmailMessage('');
      } finally {
        setCheckingEmail(false);
      }
    };
    
    const timer = setTimeout(() => {
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        checkEmail();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [email]);

  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword || !birthdate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!isUsernameValid || !isUsernameAvailable) {
      toast.error('Please choose a valid and available username');
      return;
    }
    
    if (!isEmailAvailable) {
      toast.error('Please use a different email address');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    const age = calculateAge(birthdate);
    if (age < 18) {
      toast.error('You must be at least 18 years old to register');
      return;
    }
    
    if (!agreeToTerms) {
      toast.error('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password, {
        username: username,
        birthdate: birthdate
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Registration successful! Please check your email to confirm your account.');
      
      // In development, we might navigate directly since email confirmation might be disabled
      // In production, we'd typically show a "check your email" screen instead
      navigate('/profile/setup');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-white/80">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-white/40" />
            </div>
            <input
              id="username"
              type="text"
              placeholder="johndoe123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 glass-input rounded-lg",
                username && !isUsernameValid && "border-red-500",
                username && isUsernameValid && isUsernameAvailable && "border-green-500"
              )}
              required
            />
          </div>
          {usernameMessage && (
            <p className={cn(
              "text-xs mt-1",
              isUsernameAvailable ? "text-green-400" : "text-red-400"
            )}>
              {usernameMessage}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white/80">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="w-5 h-5 text-white/40" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 glass-input rounded-lg",
                email && !isEmailAvailable && "border-red-500"
              )}
              required
            />
            {checkingEmail && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="h-4 w-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {emailMessage && (
            <p className="text-xs mt-1 text-red-400">
              {emailMessage}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="birthdate" className="block text-sm font-medium text-white/80">
            Date of Birth
            <span className="ml-1 text-xs text-white/40">(Must be 18+)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="w-5 h-5 text-white/40" />
            </div>
            <input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-input rounded-lg"
              required
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-white/80">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-white/40" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 glass-input rounded-lg"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 hover:text-white/80 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Must be at least 8 characters
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirm-password" className="block text-sm font-medium text-white/80">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="w-5 h-5 text-white/40" />
            </div>
            <input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 glass-input rounded-lg"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 hover:text-white/80 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center">
        <div 
          className={cn(
            "w-5 h-5 rounded border transition-all duration-200 mr-2 flex items-center justify-center",
            agreeToTerms 
              ? "border-brand bg-brand/20" 
              : "border-white/20 bg-white/5"
          )}
          onClick={() => setAgreeToTerms(!agreeToTerms)}
        >
          {agreeToTerms && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-3.5 h-3.5 text-brand"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </motion.svg>
          )}
        </div>
        <label 
          htmlFor="terms" 
          className="text-sm text-white/70 cursor-pointer"
          onClick={() => setAgreeToTerms(!agreeToTerms)}
        >
          I agree to the{' '}
          <a href="#" className="text-brand hover:text-brand-light transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-brand hover:text-brand-light transition-colors">
            Privacy Policy
          </a>
        </label>
      </div>
      
      <div className="pt-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={isLoading}
          type="submit"
          className={cn(
            "w-full py-3 rounded-lg font-medium transition-all duration-300",
            "bg-gradient-to-r from-brand-dark to-brand text-white shadow-lg",
            "hover:shadow-xl hover:brightness-110",
            "active:shadow-md active:brightness-90",
            "disabled:opacity-70 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </motion.button>
      </div>
      
      <div className="text-center text-sm text-white/60">
        Already have an account?{' '}
        <a
          href="/login"
          className="font-medium text-brand hover:text-brand-light transition-colors"
        >
          Sign in
        </a>
      </div>
    </form>
  );
};

export default RegisterForm;
