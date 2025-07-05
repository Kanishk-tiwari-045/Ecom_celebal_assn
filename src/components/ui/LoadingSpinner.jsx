import React from 'react';
import { cn } from '../../utils';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className,
  text,
  variant = 'spinner'
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-400',
    accent: 'border-accent-500',
    white: 'border-white'
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Spinner variant
  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className={cn(
          'animate-spin rounded-full border-2 border-secondary-700',
          sizeClasses[size],
          colorClasses[color]
        )} />
        {text && (
          <p className={cn(
            'mt-3 text-secondary-400 font-medium animate-pulse',
            textSizeClasses[size]
          )}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Dots variant
  if (variant === 'dots') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className="flex space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={cn(
                'rounded-full animate-bounce',
                size === 'xs' ? 'w-2 h-2' : 
                size === 'sm' ? 'w-3 h-3' :
                size === 'md' ? 'w-4 h-4' :
                size === 'lg' ? 'w-5 h-5' : 'w-6 h-6',
                color === 'primary' ? 'bg-primary-500' :
                color === 'secondary' ? 'bg-secondary-400' :
                color === 'accent' ? 'bg-accent-500' : 'bg-white'
              )}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
        {text && (
          <p className={cn(
            'mt-3 text-secondary-400 font-medium',
            textSizeClasses[size]
          )}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Pulse variant
  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className={cn(
          'rounded-full animate-pulse',
          sizeClasses[size],
          color === 'primary' ? 'bg-primary-500/20 border-2 border-primary-500/30' :
          color === 'secondary' ? 'bg-secondary-400/20 border-2 border-secondary-400/30' :
          color === 'accent' ? 'bg-accent-500/20 border-2 border-accent-500/30' : 
          'bg-white/20 border-2 border-white/30'
        )} />
        {text && (
          <p className={cn(
            'mt-3 text-secondary-400 font-medium animate-pulse',
            textSizeClasses[size]
          )}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Bars variant
  if (variant === 'bars') {
    return (
      <div className={cn('flex flex-col items-center justify-center', className)}>
        <div className="flex items-end space-x-1">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={cn(
                'animate-pulse',
                size === 'xs' ? 'w-1 h-4' : 
                size === 'sm' ? 'w-1.5 h-6' :
                size === 'md' ? 'w-2 h-8' :
                size === 'lg' ? 'w-2.5 h-10' : 'w-3 h-12',
                color === 'primary' ? 'bg-primary-500' :
                color === 'secondary' ? 'bg-secondary-400' :
                color === 'accent' ? 'bg-accent-500' : 'bg-white'
              )}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        {text && (
          <p className={cn(
            'mt-3 text-secondary-400 font-medium',
            textSizeClasses[size]
          )}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Ring variant (default)
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className={cn(
        'animate-spin rounded-full border-4 border-secondary-700/30',
        sizeClasses[size],
        color === 'primary' ? 'border-t-primary-500' :
        color === 'secondary' ? 'border-t-secondary-400' :
        color === 'accent' ? 'border-t-accent-500' : 'border-t-white'
      )} />
      {text && (
        <p className={cn(
          'mt-3 text-secondary-400 font-medium animate-pulse',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

// Skeleton loader component
export const SkeletonLoader = ({ 
  className, 
  variant = 'text',
  lines = 3,
  width = 'full'
}) => {
  const widthClasses = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4'
  };

  if (variant === 'text') {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-4 bg-secondary-700/30 rounded animate-pulse',
              index === lines - 1 ? widthClasses['3/4'] : widthClasses[width]
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('bg-secondary-800/50 rounded-xl p-6 animate-pulse', className)}>
        <div className="w-full h-48 bg-secondary-700/30 rounded-lg mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-secondary-700/30 rounded w-3/4" />
          <div className="h-4 bg-secondary-700/30 rounded w-1/2" />
          <div className="h-6 bg-secondary-700/30 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={cn('flex items-center space-x-4', className)}>
        <div className="w-12 h-12 bg-secondary-700/30 rounded-full animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-secondary-700/30 rounded w-1/2 animate-pulse" />
          <div className="h-3 bg-secondary-700/30 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-secondary-700/30 animate-pulse rounded',
      variant === 'circle' ? 'rounded-full' : 'rounded-lg',
      className
    )} />
  );
};

// Full page loader
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <LoadingSpinner size="xl" color="primary" />
          <div className="absolute inset-0 animate-ping">
            <div className="w-16 h-16 border-2 border-primary-500/20 rounded-full" />
          </div>
        </div>
        <p className="text-secondary-300 mt-6 text-lg font-medium animate-pulse">
          {message}
        </p>
        <div className="mt-4 flex justify-center space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
