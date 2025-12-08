import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Studio } from './pages/Studio';
import { Dashboard } from './pages/Dashboard';
import { Loader } from './components/Loader';
import { Page } from './types';
import { ToastContainer, PageErrorState, Notification, NotificationType } from './components/Notifications';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initial load
  
  // Theme state: default to 'dark' as requested
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // --- GLOBAL NOTIFICATION & ERROR STATE ---
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [criticalError, setCriticalError] = useState<{msg: string, code: string} | null>(null);

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

  // --- GLOBAL HANDLERS ---
  const addNotification = (type: NotificationType, title: string, message?: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const dismissNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const triggerUserError = () => {
      addNotification('error', 'Connection Refused', 'Failed to connect to RPC endpoint. Retrying...');
  };

  const triggerPageCrash = () => {
      setCriticalError({ msg: 'Distributed Ledger Sync Failed: Node unreachable.', code: 'CRITICAL_RPC_TIMEOUT' });
  };

  const handlePageRetry = () => {
      setCriticalError(null);
      setIsLoading(true);
      setTimeout(() => {
          setIsLoading(false);
          addNotification('success', 'System Recovered', 'Connection re-established successfully.');
      }, 2000);
  };

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
        return (
          <Landing 
            onNavigate={handleNavigate} 
            onTestError={triggerUserError} 
            onTestCrash={triggerPageCrash}
          />
        );
      case Page.STUDIO:
        return (
          <Studio 
            addNotification={addNotification}
          />
        );
      case Page.DASHBOARD:
        return <Dashboard />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {isLoading && !criticalError && <Loader />}
      
      {/* Global Notifications Layer */}
      <ToastContainer notifications={notifications} onDismiss={dismissNotification} />
      
      {/* Global Critical Error Layer */}
      {criticalError && (
          <PageErrorState 
              error={criticalError.msg} 
              code={criticalError.code}
              onRetry={handlePageRetry} 
          />
      )}

      <Layout 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        theme={theme}
        toggleTheme={toggleTheme}
      >
        {!criticalError && renderPage()}
      </Layout>
    </>
  );
};

export default App;