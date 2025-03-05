
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DollarSign, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  subActions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    color?: string;
  }>;
}

const FloatingActionButton = ({
  icon,
  onClick,
  className,
  position = 'bottom-right',
  subActions = []
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Map position to appropriate Tailwind classes
  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4'
  };
  
  const handleMainButtonClick = () => {
    if (subActions.length > 0) {
      setIsOpen(!isOpen);
    } else {
      onClick();
    }
  };
  
  // Particle animation effect for tribute button
  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: [0, 1, 0], scale: [0, 1.5], transition: { duration: 0.8 } }
  };
  
  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * 20;
      const y = Math.sin(angle) * 20;
      particles.push(
        <motion.div
          key={i}
          initial="initial"
          animate="animate"
          variants={particleVariants}
          className="absolute w-2 h-2 rounded-full bg-brand"
          style={{ 
            left: '50%', 
            top: '50%', 
            x: x, 
            y: y 
          }}
        />
      );
    }
    return particles;
  };
  
  return (
    <div className={cn("fixed z-50", positionClasses[position])}>
      {/* Sub-actions menu */}
      <AnimatePresence>
        {isOpen && subActions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 mb-2 space-y-2"
          >
            {subActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * (subActions.length - index) }}
                onClick={() => {
                  setIsOpen(false);
                  action.onClick();
                }}
                className={cn(
                  "flex items-center bg-glass backdrop-blur-lg border border-white/10",
                  "px-3 py-2 rounded-full shadow-lg",
                  "transition-all duration-300 hover:scale-105",
                  action.color || "text-white"
                )}
              >
                <span className="mr-2">{action.icon}</span>
                <span className="text-sm whitespace-nowrap">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main floating action button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMainButtonClick}
        className={cn(
          "relative flex items-center justify-center",
          "w-14 h-14 rounded-full bg-brand shadow-lg",
          "text-white text-3xl",
          className
        )}
      >
        {isOpen ? <X size={24} /> : icon}
        
        {/* Particle animation effect */}
        <AnimatePresence>
          {!isOpen && createParticles()}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
