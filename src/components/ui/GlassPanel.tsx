
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'light' | 'medium' | 'dark';
  borderIntensity?: 'none' | 'light' | 'medium';
  hoverEffect?: boolean;
  children: React.ReactNode;
}

const GlassPanel = ({
  intensity = 'medium',
  borderIntensity = 'light',
  hoverEffect = false,
  className,
  children,
  ...props
}: GlassPanelProps) => {
  // Map intensity to appropriate background opacity
  const bgClasses = {
    light: 'bg-glass backdrop-blur-md',
    medium: 'bg-glass-10 backdrop-blur-xl',
    dark: 'bg-glass-20 backdrop-blur-xl',
  };
  
  // Map border intensity to appropriate border styles
  const borderClasses = {
    none: 'border-0',
    light: 'border border-white/10',
    medium: 'border border-white/20',
  };
  
  // Optional hover effect
  const hoverClasses = hoverEffect
    ? 'transition-all duration-300 hover:bg-glass-20 hover:border-white/30'
    : '';

  return (
    <div
      className={cn(
        bgClasses[intensity],
        borderClasses[borderIntensity],
        hoverClasses,
        'rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassPanel;
