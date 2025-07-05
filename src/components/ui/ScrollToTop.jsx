import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '../../utils';

const ScrollToTop = ({ 
  threshold = 300,
  smooth = true,
  className,
  showProgress = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Show button when scrolled past threshold
      setIsVisible(scrolled > threshold);
      
      // Calculate scroll progress
      if (showProgress && maxHeight > 0) {
        const progress = (scrolled / maxHeight) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          toggleVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    toggleVisibility();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, showProgress]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 right-6 z-50 group',
        'w-12 h-12 rounded-full',
        'bg-secondary-800/80 hover:bg-secondary-700/90',
        'border border-secondary-600/50 hover:border-primary-500/50',
        'backdrop-blur-md shadow-lg hover:shadow-xl',
        'transition-all duration-300 ease-out',
        'transform hover:scale-110 active:scale-95',
        'animate-fade-in',
        className
      )}
      aria-label="Scroll to top"
    >
      {/* Progress ring */}
      {showProgress && (
        <div className="absolute inset-0 -rotate-90">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-secondary-700/30"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress circle */}
            <path
              className="text-primary-500 transition-all duration-300 ease-out"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${scrollProgress}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      )}

      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <ChevronUp 
          className={cn(
            'w-5 h-5 text-secondary-300 group-hover:text-white',
            'transition-all duration-300',
            'group-hover:-translate-y-0.5'
          )} 
        />
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-full bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
    </button>
  );
};

// Alternative floating action button style
export const FloatingScrollButton = ({ 
  position = 'bottom-right',
  size = 'md',
  variant = 'primary'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-secondary-700 hover:bg-secondary-600 text-secondary-200',
    accent: 'bg-accent-600 hover:bg-accent-700 text-white'
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className={cn(
        'fixed z-50 transition-all duration-300',
        positionClasses[position],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <button
        onClick={scrollToTop}
        className={cn(
          'rounded-full shadow-lg hover:shadow-xl',
          'transition-all duration-300 transform hover:scale-110',
          'flex items-center justify-center',
          'border border-white/10',
          sizeClasses[size],
          variantClasses[variant]
        )}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
};

// Minimal scroll indicator
export const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrolled / maxHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-secondary-800/50 z-50">
      <div 
        className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

export default ScrollToTop;
