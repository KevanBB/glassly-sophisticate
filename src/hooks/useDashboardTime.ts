
import { useState, useEffect } from 'react';

export function useDashboardTime() {
  const [time, setTime] = useState(new Date());
  const [backgroundClass, setBackgroundClass] = useState('from-dark-200 to-dark');
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();
      setTime(newTime);
      
      const hour = newTime.getHours();
      if (hour >= 6 && hour < 12) {
        setBackgroundClass('from-brand-light/20 to-dark');
      } else if (hour >= 12 && hour < 18) {
        setBackgroundClass('from-brand/20 to-dark');
      } else {
        setBackgroundClass('from-dark-200 to-dark');
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { time, backgroundClass };
}
