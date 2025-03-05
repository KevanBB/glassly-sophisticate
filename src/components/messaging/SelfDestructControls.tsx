
import React from 'react';
import { Clock, X } from 'lucide-react';

interface SelfDestructControlsProps {
  destructTime: number;
  setDestructTime: React.Dispatch<React.SetStateAction<number>>;
  setIsSelfDestruct: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelfDestructControls: React.FC<SelfDestructControlsProps> = ({ 
  destructTime, 
  setDestructTime, 
  setIsSelfDestruct 
}) => {
  return (
    <div className="px-4 py-2 bg-yellow-900/20 border-t border-yellow-600/30 flex items-center justify-between">
      <div className="flex items-center text-sm text-yellow-400">
        <Clock size={16} className="mr-2" />
        <span>Self-destructing message: {destructTime} minutes</span>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => setDestructTime(prev => Math.max(1, prev - 1))}
          className="text-xs text-white/80 hover:text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center"
        >
          -
        </button>
        <span className="text-white/80 text-sm">{destructTime}</span>
        <button 
          onClick={() => setDestructTime(prev => Math.min(60, prev + 1))}
          className="text-xs text-white/80 hover:text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center"
        >
          +
        </button>
        <button 
          onClick={() => setIsSelfDestruct(false)}
          className="text-xs text-white/80 hover:text-white bg-white/10 rounded-full w-6 h-6 flex items-center justify-center ml-2"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default SelfDestructControls;
