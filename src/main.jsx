import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Performance monitoring (optional)
if (import.meta.env.DEV) {
  // Development-only performance monitoring
  const logPerformance = () => {
    if (window.performance) {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('🚀 App Performance Metrics:', {
        'DOM Content Loaded': `${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`,
        'Load Complete': `${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`,
        'Total Load Time': `${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`
      });
    }
  };

  window.addEventListener('load', logPerformance);
}

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the default browser error handling
  event.preventDefault();
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// React 18 Concurrent Features
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hot Module Replacement (HMR) for development
if (import.meta.hot) {
  import.meta.hot.accept();
}
