// src/pages/SettingsPage.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const SettingsPage = () => {
  const { theme } = useTheme(); // Access theme
  return (
    <div className={`page-container ${theme}-theme`}>
      <h1 className="page-title">Settings</h1>
      <p>Adjust application settings.</p>
    </div>
  );
};

export default SettingsPage;