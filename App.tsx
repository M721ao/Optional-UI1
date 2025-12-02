import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Studio } from './pages/Studio';
import { Dashboard } from './pages/Dashboard';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);

  const renderPage = () => {
    switch (currentPage) {
      case Page.LANDING:
        return <Landing onNavigate={setCurrentPage} />;
      case Page.STUDIO:
        return <Studio />;
      case Page.DASHBOARD:
        return <Dashboard />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;