import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // NavLink for active styling, useLocation for theme button positioning
import { useTheme } from '../context/ThemeContext'; // Import theme context
import './Sidebar.css'; // We'll create this CSS next

const Sidebar = () => {
    const { theme, toggleTheme } = useTheme(); // Get theme and toggle function
    const location = useLocation(); // To check current path for active link

    // Hide sidebar on login page
    if (location.pathname === '/') {
        return null;
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="material-icons app-logo">check_circle_outline</span>
                <h2>Taskify</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <span className="material-icons">dashboard</span> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tasks" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <span className="material-icons">task_alt</span> My Tasks
                        </NavLink>
                    </li>
                    <li>
                        {/* This will eventually lead to a Recycle Bin page component */}
                        <NavLink to="/recycle-bin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <span className="material-icons">delete_outline</span> Recycle Bin
                        </NavLink>
                    </li>
                    <li>
                        {/* This will eventually lead to a Settings page component */}
                        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <span className="material-icons">settings</span> Settings
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                 {/* Theme Toggle Button */}
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    <span className="material-icons">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <p>&copy; {new Date().getFullYear()} Taskify</p>
            </div>
        </aside>
    );
};

export default Sidebar;