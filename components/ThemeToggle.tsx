import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-4">
        <div className="flex items-center justify-between p-2 bg-[var(--muted-background)] rounded-lg">
            <span className="text-sm font-medium text-[var(--text-secondary)] px-2">Theme</span>
            <button
            onClick={toggleTheme}
            className="relative inline-flex items-center h-8 w-14 rounded-full bg-[var(--background)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] focus:ring-offset-[var(--card-background)]"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
            <span
                className={`${
                theme === 'light' ? 'translate-x-1' : 'translate-x-7'
                } inline-flex items-center justify-center h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform`}
            >
                {theme === 'light' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                <Moon className="h-4 w-4 text-blue-500" />
                )}
            </span>
            </button>
        </div>
    </div>
  );
};

export default ThemeToggle;