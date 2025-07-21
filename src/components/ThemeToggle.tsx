import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <SunIcon
          className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-200 ${
            theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`}
        />
        <MoonIcon
          className={`absolute inset-0 w-6 h-6 text-blue-600 transition-all duration-200 ${
            theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;