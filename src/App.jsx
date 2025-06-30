import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage'; // Import TasksPage
// import RecycleBinPage from './pages/RecycleBinPage';
// import SettingsPage from './pages/SettingsPage';

import Sidebar from './components/Sidebar'; // Import Sidebar

// Layout component for authenticated routes (includes sidebar and main content)
const AuthenticatedLayout = ({ children }) => {
    return (
        <div className="app-layout"> {/* This class is styled in index.css */}
            <Sidebar />
            <main className="main-content"> {/* This class is styled in index.css */}
                {children || <Outlet />} {/* Render children or nested routes */}
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
            <Router>
                <Routes>
                    {/* Public Route: Login Page */}
                    <Route path="/" element={<LoginPage />} />

                    {/* Private Routes grouped under a common layout */}
                    <Route element={<PrivateRoute><AuthenticatedLayout /></PrivateRoute>}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/tasks" element={<TasksPage />} /> {/* New Tasks Route */}
                        {/* Placeholder for other private routes */}
                        <Route path="/recycle-bin" element={<h2>Recycle Bin Page (Coming Soon)</h2>} />
                        <Route path="/settings" element={<h2>Settings Page (Coming Soon)</h2>} />
                    </Route>

                    {/* Catch-all for undefined routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;