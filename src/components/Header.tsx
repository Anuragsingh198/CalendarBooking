import React from 'react';
import { CalendarDaysIcon, HomeIcon } from '@heroicons/react/24/outline';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, onBackClick }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="w-[100%] mx-auto px-4 sm:px-6 lg:px-8 px-11">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">

            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <CalendarDaysIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                HealthTick
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            </div>
          </div>
          
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;