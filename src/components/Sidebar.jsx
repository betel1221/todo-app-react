import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    if (location.pathname === '/') {
        return null;
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="material-icons app-logo">check_circle_outline</span>
                <h2>Tudu</h2> {/* Changed from Taskify to Tudu */}
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
                        <NavLink to="/recycle-bin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <span className="material-icons">delete_outline</span> Recycle Bin
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                            <span className="material-icons">settings</span> Settings
                        </NavLink>
                    </li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                <button onClick={toggleTheme} className="theme-toggle-btn">
                    <span className="material-icons">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <p>&copy; {new Date().getFullYear()} Tudu</p> {/* Changed from Taskify to Tudu */}
            </div>
        </aside>
    );
};

export default Sidebar;