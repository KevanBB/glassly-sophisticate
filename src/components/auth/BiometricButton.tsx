
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define a type that combines the motion button props with our custom props
interface BiometricButtonProps extends Omit<HTMLMotionProps<"button">, 'type'> {
  type?: 'faceid' | 'touchid';
  buttonType?: 'submit' | 'reset' | 'button';
}

const BiometricButton = ({
  type = 'touchid',
  buttonType = 'button',
  className,
  ...props
}: BiometricButtonProps) => {
  const isFaceId = type === 'faceid';
  
  return (
    <motion.button
      type={buttonType}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative w-12 h-12 flex items-center justify-center',
        'bg-white/5 backdrop-blur-md rounded-full',
        'border border-white/10 hover:border-white/20',
        'transition-all duration-300',
        className
      )}
      {...props}
    >
      {isFaceId ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 4H5C4.44772 4 4 4.44772 4 5V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 4H19C19.5523 4 20 4.44772 20 5V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 20H5C4.44772 20 4 19.5523 4 19V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 20H19C19.5523 20 20 19.5523 20 19V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 10V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 10V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 12H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <Fingerprint className="w-5 h-5 text-white" />
      )}
      
      {/* Subtle pulsing effect around the button */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="absolute w-full h-full rounded-full bg-white/5"
      />
    </motion.button>
  );
};

export default BiometricButton;
