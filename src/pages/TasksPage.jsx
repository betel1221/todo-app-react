import React, { useState, useEffect } from 'react';
import './TasksPage.css'; // We'll create this CSS next

const TasksPage = () => {
    const [tasks, setTasks] = useState(() => {
        // Load tasks from localStorage on initial render
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [newTaskText, setNewTaskText] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
    const [sortBy, setSortBy] = useState('latest'); // 'latest', 'oldest', 'alpha'
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Save tasks to localStorage whenever the 'tasks' state changes
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTaskText.trim() === '') return;

        const newTask = {
            id: Date.now(), // Simple unique ID
            text: newTaskText.trim(),
            status: 'active', // 'active', 'completed', 'cleared'
            createdAt: new Date().toISOString(),
            completedAt: null,
            deletedAt: null, // For recycling bin
        };

        setTasks([newTask, ...tasks]); // Add new task to the top
        setNewTaskText('');
    };

    const handleToggleStatus = (id) => {
        setTasks(tasks.map(task =>
            task.id === id
                ? {
                    ...task,
                    status: task.status === 'completed' ? 'active' : 'completed',
                    completedAt: task.status === 'completed' ? null : new Date().toISOString()
                }
                : task
        ));
    };

    const handleDeleteTask = (id) => {
        // Move to 'cleared' status (Recycle Bin) instead of truly deleting
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, status: 'cleared', deletedAt: new Date().toISOString() } : task
        ));
    };

    const handleEditClick = (task) => {
        setEditTaskId(task.id);
        setEditTaskText(task.text);
    };

    const handleEditSave = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, text: editTaskText.trim() } : task
        ));
        setEditTaskId(null);
        setEditTaskText('');
    };

    const handleEditCancel = () => {
        setEditTaskId(null);
        setEditTaskText('');
    };

    const handleClearCompleted = () => {
        // Moves all completed tasks to 'cleared' status
        setTasks(tasks.map(task =>
            task.status === 'completed' ? { ...task, status: 'cleared', deletedAt: new Date().toISOString() } : task
        ));
    };

    const handleRestoreTask = (id) => {
        // Restore from cleared to active
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, status: 'active', deletedAt: null } : task
        ));
    };

    const handlePermanentDelete = (id) => {
        // Permanently remove from the array
        setTasks(tasks.filter(task => task.id !== id));
    };

    // Filtered and Sorted Tasks Logic
    const filteredTasks = tasks.filter(task => {
        const matchesFilter = (filter === 'all' && task.status !== 'cleared') ||
                              (filter === 'active' && task.status === 'active') ||
                              (filter === 'completed' && task.status === 'completed') ||
                              (filter === 'cleared' && task.status === 'cleared'); // For Recycle Bin
        const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'latest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sortBy === 'alpha') {
            return a.text.localeCompare(b.text);
        }
        return 0;
    });


    return (
        <div className="tasks-container">
            <h1 className="page-title">Your Tasks</h1>

            {/* Task Input Section */}
            <section className="task-input-section">
                <form onSubmit={handleAddTask} className="add-task-form">
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                    />
                    <button type="submit" className="add-task-btn">
                        <span className="material-icons">add_task</span> Add Task
                    </button>
                </form>
            </section>

            {/* Task Controls (Filters, Sort, Clear Completed) */}
            <section className="task-controls">
                <div className="filters">
                    <label>Filter:</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All (Active & Completed)</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cleared">Recycle Bin</option> {/* This option will be more relevant for recycle bin page later */}
                    </select>
                </div>
                <div className="sort-by">
                    <label>Sort By:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="alpha">Alphabetical</option>
                    </select>
                </div>
                <div className="search-bar">
                    <span className="material-icons search-icon">search</span>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button onClick={handleClearCompleted} className="clear-completed-btn">
                    <span className="material-icons">delete_outline</span> Clear Completed
                </button>
            </section>

            {/* Task List Section */}
            <section className="task-list-section">
                {sortedTasks.length === 0 && (
                    <p className="no-tasks-message">
                        {filter === 'all' && 'You have no tasks yet! Start by adding one above.'}
                        {filter === 'active' && 'No active tasks. Time to relax or add more!'}
                        {filter === 'completed' && 'No completed tasks. Get to work!'}
                        {filter === 'cleared' && 'Recycle Bin is empty. Nothing to restore or delete.'}
                        {filter !== 'all' && filter !== 'active' && filter !== 'completed' && filter !== 'cleared' && 'No tasks found matching your criteria.'}
                    </p>
                )}

                <ul className="task-list">
                    {sortedTasks.map(task => (
                        <li key={task.id} className={`task-item ${task.status}`}>
                            {editTaskId === task.id ? (
                                <div className="edit-mode">
                                    <input
                                        type="text"
                                        value={editTaskText}
                                        onChange={(e) => setEditTaskText(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') handleEditSave(task.id);
                                        }}
                                    />
                                    <button onClick={() => handleEditSave(task.id)} className="save-btn">
                                        <span className="material-icons">done</span>
                                    </button>
                                    <button onClick={handleEditCancel} className="cancel-btn">
                                        <span className="material-icons">close</span>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {filter !== 'cleared' && ( // Don't show checkbox for cleared tasks
                                        <input
                                            type="checkbox"
                                            checked={task.status === 'completed'}
                                            onChange={() => handleToggleStatus(task.id)}
                                            className="task-checkbox"
                                        />
                                    )}
                                    <span className="task-text">{task.text}</span>
                                    <div className="task-actions">
                                        {filter === 'cleared' ? (
                                            <>
                                                <button onClick={() => handleRestoreTask(task.id)} className="restore-btn">
                                                    <span className="material-icons">restore_from_trash</span> Restore
                                                </button>
                                                <button onClick={() => handlePermanentDelete(task.id)} className="permanent-delete-btn">
                                                    <span className="material-icons">delete_forever</span> Delete
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(task)} className="edit-btn">
                                                    <span className="material-icons">edit</span>
                                                </button>
                                                <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                                                    <span className="material-icons">delete</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default TasksPage;