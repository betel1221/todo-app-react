import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import theme context
import './SettingsPage.css'; // We'll create this CSS next

const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme(); // Get theme and toggle function

    return (
        <div className="settings-container">
            <h1 className="page-title">Settings</h1>
            <div className="settings-section">
                <h2>Theme</h2>
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    <span className="material-icons">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;