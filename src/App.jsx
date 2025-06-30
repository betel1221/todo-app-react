import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // We'll create this next
// Import other pages later
// import TasksPage from './pages/TasksPage';
// import RecycleBinPage from './pages/RecycleBinPage';
// import SettingsPage from './pages/SettingsPage';

// A simple component to check if the user is "logged in"
// In a real app, this would involve checking a token, not just localStorage
const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Route: Login Page */}
                <Route path="/" element={<LoginPage />} />

                {/* Private Route: Dashboard Page */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />

                {/* Placeholder for other private routes - uncomment and add later */}
                {/*
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute>
                            <TasksPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/recycle-bin"
                    element={
                        <PrivateRoute>
                            <RecycleBinPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PrivateRoute>
                            <SettingsPage />
                        </PrivateRoute>
                    }
                />
                */}

                {/* Catch-all for undefined routes (optional) */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;