import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import './DashboardPage.css'; // We'll create this CSS next

// Placeholder for chart library imports (will add later)
// import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Retrieve logged-in user's name
        const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            // For now, just display the email/username. In a real app, you might fetch user profile.
            setUserName(loggedInUser.split('@')[0] || loggedInUser); // Display part before @ or full name
        }

        // Simulating some task data for charts (will be dynamic later)
        const dummyTasks = [
            { id: 1, name: 'Finish React Login Page', status: 'completed' },
            { id: 2, name: 'Plan Dashboard Layout', status: 'active' },
            { id: 3, name: 'Buy Groceries', status: 'active' },
            { id: 4, name: 'Call John', status: 'completed' },
            { id: 5, name: 'Read a book', status: 'cleared' },
        ];
        // You'd process this data for charts here
    }, []);

    const handleLogout = () => {
        // Clear all authentication-related storage
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('loggedInUser');

        alert('You have been logged out.');
        navigate('/'); // Use navigate hook to go to the login page
    };

    // Dummy data for Pie Chart (will be dynamic based on tasks)
    const pieChartData = [
        { name: 'Completed', value: 2, color: '#28a745' }, // Green
        { name: 'Active', value: 2, color: '#007bff' },    // Blue
        { name: 'Cleared', value: 1, color: '#6c757d' },   // Gray
    ];

    // Dummy data for Daily Activity Bar Chart
    const dailyActivityData = [
        { name: 'Mon', tasksAdded: 5, tasksCompleted: 2 },
        { name: 'Tue', tasksAdded: 3, tasksCompleted: 1 },
        { name: 'Wed', tasksAdded: 7, tasksCompleted: 4 },
        { name: 'Thu', tasksAdded: 4, tasksCompleted: 3 },
        { name: 'Fri', tasksAdded: 6, tasksCompleted: 2 },
        { name: 'Sat', tasksAdded: 2, tasksCompleted: 1 },
        { name: 'Sun', tasksAdded: 1, tasksCompleted: 0 },
    ];

    // Dummy Recent Activity Log
    const recentActivity = [
        { type: 'completed', task: 'Task "X"', time: '2 hours ago' },
        { type: 'edited', task: 'Task "Y"', time: 'yesterday' },
        { type: 'added', task: 'Task "Z"', time: 'on June 29' },
    ];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {userName || 'User'}!</h1>
                <button onClick={handleLogout} className="logout-btn">
                    <span className="material-icons">logout</span> Logout
                </button>
            </header>

            <section className="task-overview-cards">
                <div className="card total-tasks">
                    <span className="material-icons">list_alt</span>
                    <h3>Total Tasks</h3>
                    <p>15</p>
                </div>
                <div className="card active-tasks">
                    <span className="material-icons">pending_actions</span>
                    <h3>Active Tasks</h3>
                    <p>7</p>
                </div>
                <div className="card completed-tasks">
                    <span className="material-icons">check_circle_outline</span>
                    <h3>Completed Tasks</h3>
                    <p>5</p>
                </div>
                <div className="card cleared-tasks">
                    <span className="material-icons">delete_sweep</span>
                    <h3>Cleared Tasks</h3>
                    <p>3</p>
                </div>
            </section>

            <section className="charts-section">
                <div className="chart-card pie-chart-container">
                    <h3>Task Status Breakdown</h3>
                    {/* Placeholder for Pie Chart */}
                    <div className="chart-placeholder" style={{ height: '250px' }}>
                        {/* Will integrate Recharts here later */}
                        <p>Pie Chart will go here (e.g., using Recharts)</p>
                        <p>(Completed vs. Active vs. Cleared)</p>
                    </div>
                    {/*
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    */}
                </div>

                <div className="chart-card bar-chart-container">
                    <h3>Daily Activity</h3>
                    {/* Placeholder for Bar Chart */}
                    <div className="chart-placeholder" style={{ height: '250px' }}>
                        {/* Will integrate Recharts here later */}
                        <p>Bar Chart will go here (e.g., using Recharts)</p>
                        <p>(Daily tasks added/completed)</p>
                    </div>
                    {/*
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dailyActivityData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="tasksAdded" fill="#8884d8" name="Tasks Added" />
                            <Bar dataKey="tasksCompleted" fill="#82ca9d" name="Tasks Completed" />
                        </BarChart>
                    </ResponsiveContainer>
                    */}
                </div>
            </section>

            <section className="recent-activity-log">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className={`activity-item ${activity.type}`}>
                            <span className="material-icons">
                                {activity.type === 'completed' && 'check_circle'}
                                {activity.type === 'edited' && 'edit'}
                                {activity.type === 'added' && 'add_task'}
                            </span>
                            <p>
                                <strong>{activity.task}</strong> {activity.type === 'completed' ? 'was completed' : activity.type === 'edited' ? 'was edited' : 'was added'} {activity.time}.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Placeholder for Achievements / Streaks */}
            <section className="achievements-section">
                <h2>Achievements & Streaks</h2>
                <p>You completed tasks 5 days in a row! 🥳</p>
                <p>Longest Streak: 10 days</p>
                <p>Most Productive Day: June 25th (7 tasks)</p>
            </section>

            {/* Placeholder for Filters & Date Range */}
            <section className="filters-section">
                <h2>Filters</h2>
                <div className="filter-options">
                    <label>
                        Date Range:
                        <select>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>All Time</option>
                        </select>
                    </label>
                    {/* Other filters like task type, priority etc. */}
                </div>
            </section>

            {/* Placeholder for Download/Share Summary */}
            <section className="summary-actions">
                <button className="download-btn">
                    <span className="material-icons">download</span> Download Summary
                </button>
                <button className="share-btn">
                    <span className="material-icons">share</span> Share Report
                </button>
            </section>
        </div>
    );
};

export default DashboardPage;