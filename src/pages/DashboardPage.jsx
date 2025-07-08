import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts'; // Import Recharts components
import './DashboardPage.css';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    // State to hold task data (initially dummy, will be from actual tasks later)
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser') || sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setUserName(loggedInUser.split('@')[0] || loggedInUser);
        }

        // --- Simulate fetching tasks ---
        // In a real app, this would come from a global state, context, or API
        const dummyTasks = [
            { id: 1, name: 'Finish React Login Page', status: 'completed', createdAt: '2025-06-25' },
            { id: 2, name: 'Plan Dashboard Layout', status: 'active', createdAt: '2025-06-26' },
            { id: 3, name: 'Buy Groceries', status: 'active', createdAt: '2025-06-27' },
            { id: 4, name: 'Call John', status: 'completed', createdAt: '2025-06-27' },
            { id: 5, name: 'Read a book', status: 'completed', createdAt: '2025-06-28' }, // Changed to completed for better pie chart demo
            { id: 6, name: 'Go to the gym', status: 'active', createdAt: '2025-06-28' },
            { id: 7, name: 'Prepare presentation', status: 'active', createdAt: '2025-06-29' },
            { id: 8, name: 'Send report', status: 'completed', createdAt: '2025-06-29' },
            { id: 9, name: 'Check emails', status: 'active', createdAt: '2025-06-30' }, // Today
            { id: 10, name: 'Write blog post', status: 'active', createdAt: '2025-06-30' }, // Today
            // Example of a 'cleared' task (from recycle bin)
            { id: 11, name: 'Old Shopping List', status: 'cleared', createdAt: '2025-06-20', deletedAt: '2025-06-22' },
        ];
        setTasks(dummyTasks);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('loggedInUser');
        navigate('/');
    };

    // --- Data Processing for Charts and Cards ---

    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(task => task.status === 'active').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const clearedTasks = tasks.filter(task => task.status === 'cleared').length;

    const pieChartData = [
        { name: 'Completed', value: completedTasks, color: '#28a745' }, // Green
        { name: 'Active', value: activeTasks, color: '#007bff' },    // Blue
        { name: 'Cleared', value: clearedTasks, color: '#6c757d' },   // Gray
    ].filter(entry => entry.value > 0); // Only show categories with tasks


    // Helper to get day name from date (for daily activity)
    const getDayName = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    // Process tasks for daily activity bar chart
    const dailyActivityMap = {}; // { 'YYYY-MM-DD': { tasksAdded: N, tasksCompleted: M } }

    tasks.forEach(task => {
        const date = task.createdAt; // Assuming createdAt is the relevant date for 'tasks added'
        if (!dailyActivityMap[date]) {
            dailyActivityMap[date] = { tasksAdded: 0, tasksCompleted: 0 };
        }
        dailyActivityMap[date].tasksAdded += 1;
        if (task.status === 'completed') {
            dailyActivityMap[date].tasksCompleted += 1;
        }
    });

    // Convert map to array for Recharts
    const dailyActivityData = Object.keys(dailyActivityMap)
        .sort() // Sort by date
        .map(date => ({
            name: getDayName(date), // Display short day name
            tasksAdded: dailyActivityMap[date].tasksAdded,
            tasksCompleted: dailyActivityMap[date].tasksCompleted,
            fullDate: date // Keep full date for tooltip if needed
        }));

    // Limit to last 7 days for more relevant chart
    const currentDay = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(currentDay);
        d.setDate(currentDay.getDate() - i);
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
    }).reverse(); // To show chronologically

    const recentDailyActivityData = last7Days.map(date => {
        const existingData = dailyActivityData.find(d => d.fullDate === date);
        return existingData || { name: getDayName(date), tasksAdded: 0, tasksCompleted: 0, fullDate: date };
    });

    // Dummy Recent Activity Log - will filter actual tasks here later
    const recentActivity = tasks
        .filter(task => task.status !== 'cleared') // Don't show cleared in recent activity usually
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by most recent
        .slice(0, 5) // Get latest 5 activities
        .map(task => {
            let type = 'added';
            if (task.status === 'completed') type = 'completed';
            // In a real app, 'edited' would be a separate log entry
            return {
                type: type,
                task: task.name,
                time: "just now" // Simplified for now, in real app, calculate time difference
            };
        });


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
                    <p>{totalTasks}</p>
                </div>
                <div className="card active-tasks">
                    <span className="material-icons">pending_actions</span>
                    <h3>Active Tasks</h3>
                    <p>{activeTasks}</p>
                </div>
                <div className="card completed-tasks">
                    <span className="material-icons">check_circle_outline</span>
                    <h3>Completed Tasks</h3>
                    <p>{completedTasks}</p>
                </div>
                <div className="card cleared-tasks">
                    <span className="material-icons">delete_sweep</span>
                    <h3>Cleared Tasks</h3>
                    <p>{clearedTasks}</p>
                </div>
            </section>

            <section className="charts-section">
                <div className="chart-card pie-chart-container">
                    <h3>Task Status Breakdown</h3>
                    {pieChartData.length > 0 ? (
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
                    ) : (
                        <div className="chart-placeholder" style={{ height: '250px' }}>
                            <p>No task data to display.</p>
                        </div>
                    )}
                </div>

                <div className="chart-card bar-chart-container">
                    <h3>Daily Activity (Last 7 Days)</h3>
                    {recentDailyActivityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={recentDailyActivityData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="tasksAdded" fill="#8884d8" name="Tasks Added" />
                                <Bar dataKey="tasksCompleted" fill="#82ca9d" name="Tasks Completed" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="chart-placeholder" style={{ height: '250px' }}>
                            <p>No daily activity data to display.</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="recent-activity-log">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
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
                        ))
                    ) : (
                        <p className="no-activity">No recent activity.</p>
                    )}
                </div>
            </section>

            <section className="achievements-section">
                <h2>Achievements & Streaks</h2>
                <p>You completed tasks 5 days in a row! 🥳</p>
                <p>Longest Streak: 10 days</p>
                <p>Most Productive Day: June 25th (7 tasks)</p>
            </section>

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
                </div>
            </section>

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