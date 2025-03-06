
import React from 'react';
import { Send } from 'lucide-react';

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

const SendButton: React.FC<SendButtonProps> = ({ onClick, disabled, isLoading }) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`p-3 rounded-full ${
        disabled || isLoading
          ? 'bg-white/10 text-white/30' 
          : 'bg-brand hover:bg-brand-light text-white'
      } transition-colors`}
    >
      {isLoading ? (
        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
      ) : (
        <Send size={20} />
      )}
    </button>
  );
};

export default SendButton;
