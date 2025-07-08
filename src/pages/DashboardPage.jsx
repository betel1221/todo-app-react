// src/pages/DashboardPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TasksContext';
import Input from '../pages/Input.jsx';

import {
    PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

import './DashboardPage.css';

// --- New Components ---

// Progress Bar Component
const ProgressBar = ({ label, percentage, colorClass }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => {
            setWidth(percentage);
        }, 100); // Small delay to ensure render before animation
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div className="progress-bar-container"> {/* Neumorphic styles applied directly in CSS */}
            <h3>{label}</h3>
            <div className="progress-bar-wrapper">
                <div
                    className={`progress-bar-fill ${colorClass}`}
                    style={{ width: `${width}%` }}
                ></div>
            </div>
            <p className="progress-percentage">{percentage.toFixed(0)}%</p>
        </div>
    );
};

// Notification Item Component
const NotificationItem = ({ type, message, onDismiss }) => {
    return (
        <div className={`notification-item ${type}`}>
            <span className="material-icons">
                {type === 'overdue' ? 'error_outline' : 'event'}
            </span>
            <p>{message}</p>
            <button onClick={onDismiss} className="dismiss-btn">
                <span className="material-icons">close</span>
            </button>
        </div>
    );
};

// Main Dashboard Page Component
const DashboardPage = ({ user }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { tasks, addTask, updateTask } = useTasks();

    // State for Quick Task Add Form
    const [newTaskText, setNewTaskText] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newPriority, setNewPriority] = useState('medium');
    const [newAssignee, setNewAssignee] = useState('');

    // State for Task Summary Table filtering
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [currentFilter, setCurrentFilter] = useState('all');

    // State for Notifications
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user) {
            console.warn("DashboardPage received no user data. Redirecting to login.");
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        // Initialize filtered tasks with all tasks when tasks context changes
        setFilteredTasks(tasks);

        // Generate notifications
        const now = new Date();
        const newNotifications = [];

        tasks.forEach(task => {
            if (task.status === 'active' && task.dueDate) {
                const dueDate = new Date(task.dueDate);
                if (dueDate < now) {
                    newNotifications.push({ id: task.id, type: 'overdue', message: `Task "${task.text}" is overdue!` });
                } else {
                    const diffTime = Math.abs(dueDate - now);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if (diffDays <= 3) { // Notify for tasks due in 3 days or less
                        newNotifications.push({ id: task.id + '-upcoming', type: 'upcoming', message: `Task "${task.text}" is due in ${diffDays} day(s)!` });
                    }
                }
            }
        });
        setNotifications(newNotifications);

    }, [tasks]); // Re-run when tasks change

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    // --- Data Processing for Charts and Cards ---
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(task => task.status === 'active').length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const clearedTasks = tasks.filter(task => task.status === 'cleared').length;
    const overdueTasks = tasks.filter(task => task.status === 'active' && task.dueDate && new Date(task.dueDate) < new Date()).length;
    const dueTodayTasks = tasks.filter(task => {
        const today = new Date().toDateString();
        const dueDate = task.dueDate ? new Date(task.dueDate).toDateString() : null;
        return task.status === 'active' && dueDate === today;
    }).length;

    const pieChartData = [
        { name: 'Completed', value: completedTasks, color: '#28a745' },
        { name: 'Active', value: activeTasks, color: '#007bff' },
        { name: 'Overdue', value: overdueTasks, color: '#dc3545' }, // Add Overdue to pie chart
        { name: 'Cleared', value: clearedTasks, color: '#6c757d' },
    ].filter(entry => entry.value > 0);

    // Helper to get day name from date (for daily activity)
    const getDayName = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    // Process tasks for daily activity bar chart
    const dailyActivityMap = {};
    tasks.forEach(task => {
        const createdAtDate = task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : 'Unknown';
        if (!dailyActivityMap[createdAtDate]) {
            dailyActivityMap[createdAtDate] = { tasksAdded: 0, tasksCompleted: 0 };
        }
        dailyActivityMap[createdAtDate].tasksAdded += 1;

        if (task.status === 'completed' && task.completedAt) {
            const completedAtDate = new Date(task.completedAt).toISOString().split('T')[0];
            if (!dailyActivityMap[completedAtDate]) {
                dailyActivityMap[completedAtDate] = { tasksAdded: 0, tasksCompleted: 0 };
            }
            dailyActivityMap[completedAtDate].tasksCompleted += 1;
        }
    });

    const recentDailyActivityData = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateString = d.toISOString().split('T')[0];
        const entry = dailyActivityMap[dateString] || { tasksAdded: 0, tasksCompleted: 0 };
        return {
            name: getDayName(dateString),
            tasksAdded: entry.tasksAdded,
            tasksCompleted: entry.tasksCompleted,
            fullDate: dateString
        };
    }).reverse();

    const recentActivity = tasks
        .filter(task => task.status !== 'cleared')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(task => {
            let type = 'added';
            if (task.status === 'completed') type = 'completed';
            return {
                type: type,
                task: task.text,
                time: new Date(task.createdAt).toLocaleString()
            };
        });

    // --- Project/Milestone Progress Data (Dummy for now) ---
    const projectProgressData = [
        { label: 'Website Redesign', percentage: 75, status: 'high' },
        { label: 'Mobile App Development', percentage: 40, status: 'medium' },
        { label: 'Marketing Campaign Launch', percentage: 90, status: 'high' },
        { label: 'Backend API Integration', percentage: 20, status: 'low' },
    ];

    // --- Dynamic Task Timeline Data (Upcoming deadlines) ---
    const upcomingDeadlines = tasks
        .filter(task => task.status === 'active' && task.dueDate && new Date(task.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5) // Show next 5 deadlines
        .map(task => ({
            date: new Date(task.dueDate).toLocaleDateString(),
            title: task.text,
            id: task.id
        }));

    // --- Quick Task Add Form Handlers ---
    const handleQuickAddTask = (e) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            const newTask = {
                id: Date.now(),
                text: newTaskText.trim(),
                status: 'active',
                createdAt: new Date().toISOString(),
                dueDate: newDueDate || null,
                priority: newPriority,
                assignee: newAssignee || null,
                completedAt: null
            };
            addTask(newTask);
            setNewTaskText('');
            setNewDueDate('');
            setNewPriority('medium');
            setNewAssignee('');
            alert('Task added successfully!');
        } else {
            alert('Task text cannot be empty!');
        }
    };

    // --- Task Summary Table Handlers ---
    const handlePieChartClick = (data, index) => {
        const category = data.name;
        let filtered = [];
        if (category === 'Completed') {
            filtered = tasks.filter(task => task.status === 'completed');
        } else if (category === 'Active') {
            // Active tasks exclude overdue ones for this filter
            filtered = tasks.filter(task => task.status === 'active' && (!task.dueDate || new Date(task.dueDate) >= new Date()));
        } else if (category === 'Overdue') {
            filtered = tasks.filter(task => task.status === 'active' && task.dueDate && new Date(task.dueDate) < new Date());
        } else if (category === 'Cleared') {
            filtered = tasks.filter(task => task.status === 'cleared');
        }
        setFilteredTasks(filtered);
        setCurrentFilter(category);
    };

    const handleTableFilterChange = (e) => {
        const filterValue = e.target.value;
        setCurrentFilter(filterValue);
        if (filterValue === 'all') {
            setFilteredTasks(tasks);
        } else if (filterValue === 'active') {
            setFilteredTasks(tasks.filter(task => task.status === 'active' && (!task.dueDate || new Date(task.dueDate) >= new Date())));
        } else if (filterValue === 'completed') {
            setFilteredTasks(tasks.filter(task => task.status === 'completed'));
        } else if (filterValue === 'overdue') {
            setFilteredTasks(tasks.filter(task => task.status === 'active' && task.dueDate && new Date(task.dueDate) < new Date()));
        } else if (filterValue === 'dueToday') {
            const today = new Date().toDateString();
            setFilteredTasks(tasks.filter(task => task.status === 'active' && task.dueDate && new Date(task.dueDate).toDateString() === today));
        }
    };

    const handleDismissNotification = (idToDismiss) => {
        setNotifications(prev => prev.filter(notif => notif.id !== idToDismiss));
    };


    return (
        <div className={`dashboard-container ${theme}-theme`}>
            <header className="dashboard-header">
                <h1>Welcome, {user ? user.username : 'User'}!</h1>
                <button onClick={handleLogout} className="logout-btn">
                    <span className="material-icons">logout</span> Logout
                </button>
            </header>

            <section className="task-overview-cards">
                <div className="card total-tasks"> {/* Neumorphic styles applied by .task-overview-cards .card */}
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
                {/* New: Overdue Tasks Widget */}
                <div className="card overdue-tasks">
                    <span className="material-icons">warning</span>
                    <h3>Overdue Tasks</h3>
                    <p>{overdueTasks}</p>
                </div>
                 {/* New: Tasks Due Today Widget */}
                <div className="card due-today-tasks">
                    <span className="material-icons">calendar_today</span>
                    <h3>Due Today</h3>
                    <p>{dueTodayTasks}</p>
                </div>
            </section>

            <section className="charts-section">
                <div className="chart-card pie-chart-container"> {/* Neumorphic styles applied by .chart-card */}
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
                                    onClick={(data, index) => handlePieChartClick(data.payload, index)} // Use payload for correct data access on click
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
                                <Bar dataKey="tasksAdded" fill={getComputedStyle(document.documentElement).getPropertyValue('--primary-brown')} name="Tasks Added" />
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

            {/* New: Progress Bars for Projects or Milestones */}
            <section className="progress-bars-section">
                <h2>Project Progress</h2>
                {projectProgressData.map((project, index) => (
                    <ProgressBar
                        key={index}
                        label={project.label}
                        percentage={project.percentage}
                        colorClass={project.status}
                    />
                ))}
            </section>

            {/* New: Dynamic Task Timeline */}
            <section className="task-timeline-section">
                <h2>Upcoming Deadlines</h2>
                <div className="timeline-wrapper"> {/* Neumorphic styles applied by .timeline-wrapper */}
                    <div className="timeline-line"></div>
                    {upcomingDeadlines.length > 0 ? (
                        upcomingDeadlines.map((item, index) => (
                            <div key={item.id || index} className="timeline-item">
                                <div className="timeline-dot"></div>
                                <div className="timeline-date">{item.date}</div>
                                <div className="timeline-title">{item.title}</div>
                            </div>
                        ))
                    ) : (
                        <p className="no-activity" style={{textAlign: 'center', width: '100%'}}>No upcoming deadlines.</p>
                    )}
                </div>
            </section>

            {/* New: Quick Task Add Form */}
            <section className="quick-add-form-section">
                <h2>Quick Add Task</h2>
                <form onSubmit={handleQuickAddTask} className="quick-add-form"> {/* Neumorphic styles applied by .quick-add-form */}
                    <div className="form-group">
                        <label htmlFor="newTaskText">Task Title</label>
                        <Input
                            id="newTaskText"
                            type="text"
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="e.g., Finish dashboard design"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newDueDate">Due Date (Optional)</label>
                        <Input
                            id="newDueDate"
                            type="date"
                            value={newDueDate}
                            onChange={(e) => setNewDueDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPriority">Priority</label>
                        <select
                            id="newPriority"
                            value={newPriority}
                            onChange={(e) => setNewPriority(e.target.value)}
                            className="custom-input" // Reuse input styling for select
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="newAssignee">Assignee (Optional)</label>
                        <Input
                            id="newAssignee"
                            type="text"
                            value={newAssignee}
                            onChange={(e) => setNewAssignee(e.target.value)}
                            placeholder="e.g., John Doe"
                        />
                    </div>
                    <button type="submit">Add Task</button>
                </form>
            </section>

            {/* New: Filterable Task Summary Table */}
            <section className="task-summary-table-section">
                <h2>Task Summary ({currentFilter === 'all' ? 'All Tasks' : currentFilter})</h2>
                <div className="filter-options" style={{ marginBottom: '20px', textAlign: 'right' }}>
                    <label>
                        Show:
                        <select value={currentFilter} onChange={handleTableFilterChange}>
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="overdue">Overdue</option>
                            <option value="dueToday">Due Today</option>
                        </select>
                    </label>
                </div>
                <div className="task-summary-table-wrapper"> {/* Neumorphic styles applied by .task-summary-table-wrapper */}
                    {filteredTasks.length > 0 ? (
                        <table className="task-summary-table">
                            <thead>
                                <tr>
                                    <th>Task Name</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    <th>Assignee</th>
                                    <th>Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map(task => (
                                    <tr key={task.id}>
                                        <td>{task.text}</td>
                                        <td>
                                            <span className={`status-badge ${task.status === 'active' && task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' : task.status}`}>
                                                {task.status === 'active' && task.dueDate && new Date(task.dueDate) < new Date() ? 'Overdue' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                                        <td>{task.assignee || 'Unassigned'}</td>
                                        <td>{task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-activity" style={{textAlign: 'center', padding: '20px'}}>No tasks match the current filter.</p>
                    )}
                </div>
            </section>

            {/* New: Interactive Notifications */}
            <section className="notifications-section">
                <h2>Notifications</h2>
                <div className="notification-panel"> {/* Neumorphic styles applied by .notification-panel */}
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <NotificationItem
                                key={notif.id}
                                type={notif.type}
                                message={notif.message}
                                onDismiss={() => handleDismissNotification(notif.id)}
                            />
                        ))
                    ) : (
                        <p className="no-activity" style={{textAlign: 'center'}}>No new notifications.</p>
                    )}
                </div>
            </section>

            <section className="recent-activity-log">
                <h2>Recent Activity</h2>
                <div className="activity-list"> {/* Neumorphic styles applied by .activity-list */}
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

            <section className="achievements-section"> {/* Neumorphic styles applied directly */}
                <h2>Achievements & Streaks</h2>
                <p>You completed tasks 5 days in a row! 🥳</p>
                <p>Longest Streak: 10 days</p>
                <p>Most Productive Day: June 25th (7 tasks)</p>
            </section>

            <section className="filters-section"> {/* Neumorphic styles applied directly */}
                <h2>Filters (Global)</h2>
                <div className="filter-options">
                    <label>
                        Date Range:
                        <select className="custom-input"> {/* Reuse input styling */}
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>All Time</option>
                        </select>
                    </label>
                </div>
            </section>

            <section className="summary-actions"> {/* Neumorphic styles applied directly */}
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