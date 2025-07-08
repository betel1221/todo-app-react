import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TasksProvider } from './context/TasksContext'; // Import TasksProvider

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import RecycleBinPage from './pages/RecycleBinPage';
import SettingsPage from './pages/SettingsPage';

import Sidebar from './components/Sidebar';

// Layout component for authenticated routes (includes sidebar and main content)
const AuthenticatedLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                {children || <Outlet />}
            </main>
        </div>
    );
};

// A simple component to check if the user is "logged in"
const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
    return (
        <ThemeProvider>
            <TasksProvider> {/* Wrap AuthenticatedLayout with TasksProvider */}
                <Router>
                    <Routes>
                        {/* Public Route: Login Page */}
                        <Route path="/" element={<LoginPage />} />

                        {/* Private Routes grouped under a common layout */}
                        <Route element={<PrivateRoute><AuthenticatedLayout /></PrivateRoute>}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/tasks" element={<TasksPage />} />
                            <Route path="/recycle-bin" element={<RecycleBinPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                        </Route>

                        {/* Catch-all for undefined routes */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </TasksProvider>
        </ThemeProvider>
    );
}

export default App;