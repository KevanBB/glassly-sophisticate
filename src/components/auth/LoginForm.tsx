import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import BiometricButton from './BiometricButton';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    toast('Biometric authentication initiated', {
      description: 'This would trigger Face ID/Touch ID on a real device',
    });
    
    // Simulated biometric login for demo purposes
    // In a real app, this would use the device's biometric API
    setTimeout(() => {
      toast.success('Biometric authentication successful');
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
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
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className={cn(
              "w-5 h-5 rounded border transition-all duration-200 mr-2 flex items-center justify-center",
              rememberMe 
                ? "border-brand bg-brand/20" 
                : "border-white/20 bg-white/5"
            )}
            onClick={() => setRememberMe(!rememberMe)}
          >
            {rememberMe && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-3 h-3 text-brand"
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
            htmlFor="remember-me" 
            className="text-sm text-white/70 cursor-pointer"
            onClick={() => setRememberMe(!rememberMe)}
          >
            Remember me
          </label>
        </div>
        
        <a href="#" className="text-sm text-brand hover:text-brand-light transition-colors">
          Forgot password?
        </a>
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
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </motion.button>
      </div>
      
      <div className="relative py-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-dark-100 px-4 text-sm text-white/50">Or continue with</span>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <BiometricButton type="touchid" onClick={handleBiometricLogin} />
      </div>
      
      <div className="text-center text-sm text-white/60">
        Don't have an account?{' '}
        <a
          href="/register"
          className="font-medium text-brand hover:text-brand-light transition-colors"
        >
          Register
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
