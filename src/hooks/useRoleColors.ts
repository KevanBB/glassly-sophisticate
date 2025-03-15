
import { useState, useCallback } from 'react';

export const useRoleColors = () => {
  const getRoleColor = useCallback((role?: string) => {
    if (!role) return '';
    
    switch(role.toLowerCase()) {
      case 'dominant':
        return 'bg-red-500/20 text-red-400';
      case 'submissive':
        return 'bg-blue-500/20 text-blue-400';
      case 'switch':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  }, []);

  return { getRoleColor };
};

export default useRoleColors;
