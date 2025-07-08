// src/pages/CalendarPage.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Assuming you want theme access here too

const CalendarPage = () => {
  const { theme } = useTheme();
  return (
    <div className={`page-container ${theme}-theme`}>
      <h1 className="page-title">Calendar</h1>
      <p>View your tasks and events on a calendar.</p>
      {/* Add your calendar content */}
    </div>
  );
};

export default CalendarPage;