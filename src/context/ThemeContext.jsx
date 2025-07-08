import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
    return useContext(ThemeContext);
};

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    // Get theme from localStorage or default to 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    // Effect to apply the theme class to the body and save to localStorage
    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
        localStorage.setItem('theme', theme);
    }, [theme]); // Rerun whenever the theme state changes

    // Function to toggle theme
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // The value provided to consumers of this context
    const value = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};