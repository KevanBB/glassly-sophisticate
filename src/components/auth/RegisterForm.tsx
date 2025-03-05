
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Calendar, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    
    if (!name || !email || !password || !confirmPassword || !birthdate) {
      toast.error('Please fill in all required fields');
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
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Registration successful! Welcome to SubSpace');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-white/80">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-white/40" />
            </div>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass-input rounded-lg"
              required
            />
          </div>
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
              className="w-full pl-10 pr-4 py-3 glass-input rounded-lg"
              required
            />
          </div>
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
              className="w-full pl-10 pr-4 py-3 glass-input rounded-lg"
              required
            />
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
