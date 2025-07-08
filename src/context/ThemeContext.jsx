// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const ThemeContext = createContext(undefined); // Default to undefined

// 2. Create a custom hook to use the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 3. Create the ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage, or default to 'light'
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    // IMPORTANT: Use classList.add/remove to manage classes without overwriting others
    // First, remove both possible theme classes to ensure clean state
    document.body.classList.remove('light-theme', 'dark-theme');

    // Then, add the current theme class
    document.body.classList.add(`${theme}-theme`); // This will add 'light-theme' or 'dark-theme'

    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // Re-run effect whenever 'theme' changes

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // The value provided to consumers of this context
  const contextValue = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};