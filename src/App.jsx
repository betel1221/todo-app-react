// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TasksProvider } from './context/TasksContext'; // Import TasksProvider

// Import all page components that will be routed
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import RecycleBinPage from './pages/RecycleBinPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';

import Sidebar from './components/Sidebar.jsx';

// AppContent handles authentication and layout, so ThemeProvider can wrap everything
const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null); // State to store user data

  // Access the current theme context
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const userJson = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setLoggedInUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user data from storage:", error);
        handleLogout(); // Clear invalid data if parsing fails
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem('loggedInUser', JSON.stringify(userData));
      sessionStorage.removeItem('loggedInUser');
    } else {
      sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
      localStorage.removeItem('loggedInUser');
    }
    setLoggedInUser(userData); // Set the logged-in user data
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUser');
    setLoggedInUser(null); // Clear logged-in user data
    setIsAuthenticated(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-800">
        Loading application...
      </div>
    );
  }

  return (
    <div className={`app-container ${theme}-theme`}>
      {isAuthenticated ? (
        <TasksProvider> {/* Wrap the authenticated part with TasksProvider */}
          <div className="app-layout flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={handleLogout} />
            <div className={`main-content flex-1 p-6 transition-all duration-300
                           ${isSidebarOpen ? 'ml-64' : 'ml-16'}
                           bg-bg-light text-text-light`}>
              <div className="flex justify-end p-2 mb-4 border-b border-border-light">
                <button onClick={toggleTheme} className="flex items-center px-4 py-2 rounded-md
                                                       bg-primary text-white hover:bg-primary-dark
                                                       transition-colors duration-200">
                  <span className="material-icons mr-2">
                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                  </span>
                  <span>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </span>
                </button>
              </div>

              <Routes>
                <Route path="/dashboard" element={<DashboardPage user={loggedInUser} />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/recycle-bin" element={<RecycleBinPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </div>
        </TasksProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
};

export default App;