import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Studio } from './pages/Studio';
import { Dashboard } from './pages/Dashboard';
import { Loader } from './components/Loader';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initial load
  
  // Theme state: default to 'dark' as requested
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Apply theme to HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Initial load effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds initial load
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (page: Page) => {
    if (page === currentPage) return;
    
    setIsLoading(true);
    // Simulate network delay / transition time
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
    }, 1200); // 1.2 seconds transition load
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.LANDING:
        // Landing page handles its own dark styling, ignoring the theme context visually if desired,
        // but here we pass it anyway.
        return <Landing onNavigate={handleNavigate} />;
      case Page.STUDIO:
        return <Studio />;
      case Page.DASHBOARD:
        return <Dashboard />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Layout 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        theme={theme}
        toggleTheme={toggleTheme}
      >
        {renderPage()}
      </Layout>
    </>
  );
};

export default App;