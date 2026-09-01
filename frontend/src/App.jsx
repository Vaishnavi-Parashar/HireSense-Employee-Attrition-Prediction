import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';

import Dashboard from './components/Dashboard';
import AttritionPrediction from './components/AttritionPrediction';
import PerformanceRisk from './components/PerformanceRisk';
import RetentionInsights from './components/RetentionInsights';
import EmployeeAnalytics from './components/EmployeeAnalytics';
import Reports from './components/Reports';
import AiAssistant from './components/AiAssistant';
import SettingsPage from './components/Settings';
import AboutUs from './components/AboutUs';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [predictionContext, setPredictionContext] = useState(null);

  const handleOpenAiWithContext = (contextData) => {
    setPredictionContext(contextData);
    setActivePage('assistant');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'prediction':
        return <AttritionPrediction onOpenAiAssistant={handleOpenAiWithContext} />;
      case 'performance':
        return <PerformanceRisk />;
      case 'insights':
        return <RetentionInsights />;
      case 'analytics':
        return <EmployeeAnalytics />;
      case 'reports':
        return <Reports />;
      case 'assistant':
        return (
          <AiAssistant
            activePredictionContext={predictionContext}
            clearPredictionContext={() => setPredictionContext(null)}
          />
        );
      case 'settings':
        return <SettingsPage />;
      case 'about':
        return <AboutUs />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: window.innerWidth >= 1024 ? '260px' : '0',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>
        <TopHeader
          activePage={activePage}
          setActivePage={setActivePage}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />

        <main style={{ padding: '2rem', flex: 1 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
