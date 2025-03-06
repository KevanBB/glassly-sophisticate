
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import GlassPanel from '@/components/ui/GlassPanel';

interface OnboardingLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

const OnboardingLayout = ({ children, title = "Welcome to Creator Onboarding", subtitle = "Let's get your creator profile set up" }: OnboardingLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="w-full max-w-2xl space-y-6">
        <GlassPanel className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-white/70">{subtitle}</p>
          </div>
          {children}
        </GlassPanel>
      </div>
    </motion.div>
  );
};

export default OnboardingLayout;
