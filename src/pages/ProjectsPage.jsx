// src/pages/ProjectsPage.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Assuming you want theme access here too

const ProjectsPage = () => {
  const { theme } = useTheme();
  return (
    <div className={`page-container ${theme}-theme`}>
      <h1 className="page-title">Projects</h1>
      <p>Manage your projects here.</p>
      {/* Add your projects content */}
    </div>
  );
};

export default ProjectsPage;