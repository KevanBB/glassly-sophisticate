
import React from 'react';
import { Clock } from 'lucide-react';

interface SelfDestructToggleProps {
  isSelfDestruct: boolean;
  toggleSelfDestruct: () => void;
}

const SelfDestructToggle: React.FC<SelfDestructToggleProps> = ({ 
  isSelfDestruct, 
  toggleSelfDestruct 
}) => {
  return (
    <button 
      onClick={toggleSelfDestruct}
      className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
        isSelfDestruct ? 'text-yellow-400' : 'text-white/70 hover:text-white'
      }`}
    >
      <Clock size={20} />
    </button>
  );
};

export default SelfDestructToggle;
