// src/components/Sidebar.jsx (No changes needed, already correct!)
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, onLogout }) => {
  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">TaskFlow</h3>
        <button className="sidebar-toggle-button material-icons" onClick={toggleSidebar}>
          {isOpen ? 'close' : 'menu'}
        </button>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
            <span className="material-icons">dashboard</span>
            <span className="sidebar-item-text">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
            <span className="material-icons">assignment_turned_in</span>
            <span className="sidebar-item-text">My Tasks</span>
          </NavLink>
        </li>
        {/* ADDED THIS LINE FOR Recycle Bin */}
        <li>
          <NavLink to="/recycle-bin" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
            <span className="material-icons">restore_from_trash</span>
            <span className="sidebar-item-text">Recycle Bin</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
            <span className="material-icons">folder_open</span>
            <span className="sidebar-item-text">Projects</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/calendar" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
            <span className="material-icons">calendar_today</span>
            <span className="sidebar-item-text">Calendar</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}>
            <span className="material-icons">settings</span>
            <span className="sidebar-item-text">Settings</span>
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-footer">
        <button className="logout-button sidebar-item" onClick={onLogout}>
          <span className="material-icons">logout</span>
          <span className="sidebar-item-text">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;