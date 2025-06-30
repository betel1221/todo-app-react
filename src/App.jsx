import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // Import ThemeProvider

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
// Import other pages later
// import TasksPage from './pages/TasksPage';
// import RecycleBinPage from './pages/RecycleBinPage';
// import SettingsPage from './pages/SettingsPage';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
    return (
        <ThemeProvider> {/* Wrap your entire app with ThemeProvider */}
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardPage />
                            </PrivateRoute>
                        }
                    />
                    {/* Other private routes will go here */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;