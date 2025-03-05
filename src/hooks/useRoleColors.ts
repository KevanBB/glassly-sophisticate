
import { useMemo } from 'react';

export function useRoleColors() {
  const getRoleColor = useMemo(() => (role: string) => {
    switch (role.toLowerCase()) {
      case 'dominant':
        return 'bg-red-600';
      case 'submissive':
        return 'bg-blue-600';
      case 'switch':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  }, []);

  const getRoleColorClass = useMemo(() => (role: string) => {
    return {
      dominant: {
        background: 'bg-red-600',
        text: 'text-red-400',
        border: 'border-red-600',
        hover: 'hover:bg-red-700',
      },
      submissive: {
        background: 'bg-blue-600',
        text: 'text-blue-400',
        border: 'border-blue-600',
        hover: 'hover:bg-blue-700',
      },
      switch: {
        background: 'bg-purple-600',
        text: 'text-purple-400',
        border: 'border-purple-600',
        hover: 'hover:bg-purple-700',
      }
    }[role.toLowerCase()] || {
      background: 'bg-gray-600',
      text: 'text-gray-400',
      border: 'border-gray-600',
      hover: 'hover:bg-gray-700',
    };
  }, []);

  return { getRoleColor, getRoleColorClass };
}
