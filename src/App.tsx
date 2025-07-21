import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CalendarView from './components/CalendarView';

type AppView = 'home' | 'calendar';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const navigateToCalendar = () => {
    setCurrentView('calendar');
  };

  const navigateToHome = () => {
    setCurrentView('home');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* {currentView === 'calendar' && ( */}
          <Header 
            title="Professional Healthcare Scheduling" 
            showBackButton={true}
            onBackClick={navigateToHome}
          />
        {/* )} */}
        
        {currentView === 'home' ? (
          <HomePage onBookCall={navigateToCalendar} />
        ) : (
          <CalendarView onBackToHome={navigateToHome} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;