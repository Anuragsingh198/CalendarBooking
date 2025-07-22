import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CalendarView from './components/CalendarView';
import axios from 'axios';

type AppView = 'home' | 'calendar';
interface Client{
  _id:string;
  clientName:string, 
  clientPhone:string,
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const navigateToCalendar = () => {
    setCurrentView('calendar');
  };

  const navigateToHome = () => {
    setCurrentView('home');
  };

const getClients = async (): Promise<Client[]> => {
  console.log("Fetching clients...");

  const {data} = await axios.get("http://localhost:5001/api/clients");
  if (!data.success) {
    throw new Error('Failed to fetch clients');
  }
  console.log("Received clients:", data.clients);
  return data.clients;
};

useEffect(()=>{

  const  fetchClients = async()=>{
      try {
        const  data =  await getClients();
        localStorage.setItem('clients' , JSON.stringify(data))
        console.log(" this ihte  data  bebore ftching: " , data)
      } catch (error) {
        console.error("Error  fetching  clents : " , error);
      }
    
  }
fetchClients();
},[])


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