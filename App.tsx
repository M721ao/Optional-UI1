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
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderPage()}
      </Layout>
    </>
  );
};

export default App;
