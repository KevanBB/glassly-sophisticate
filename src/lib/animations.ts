
import { useEffect } from 'react';

// Custom hook for triggering animations
export const useAnimationOnMount = (
  selector: string, 
  animationClass: string, 
  delay: number = 0
) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        el.classList.add(animationClass);
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [selector, animationClass, delay]);
};

// Create a sequence of animations for multiple elements
export const useSequencedAnimations = (
  selectors: string[],
  animationClass: string, 
  baseDelay: number = 0,
  incrementDelay: number = 100
) => {
  useEffect(() => {
    selectors.forEach((selector, index) => {
      const timer = setTimeout(() => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el) => {
          el.classList.add(animationClass);
        });
      }, baseDelay + (index * incrementDelay));
      
      return () => clearTimeout(timer);
    });
  }, [selectors, animationClass, baseDelay, incrementDelay]);
};

// Helper function to create CSS transition strings for dynamic/cleaner code
export const createTransition = (
  properties: string[] = ['all'], 
  duration: number = 300, 
  easing: string = 'cubic-bezier(0.4, 0, 0.2, 1)', 
  delay: number = 0
): string => {
  return properties
    .map(prop => `${prop} ${duration}ms ${easing} ${delay}ms`)
    .join(', ');
};
