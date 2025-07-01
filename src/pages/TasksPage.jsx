import React, { useState } from 'react';
import { useTasks } from '../context/TasksContext'; // Import useTasks hook
import './TasksPage.css'; // Ensure this CSS file exists and is linked

const TasksPage = () => {
    // Destructure tasks and task management functions from the global context
    const {
        tasks,
        addTask,
        toggleTaskStatus,
        softDeleteTask, // This moves a task to 'cleared' status (Recycle Bin)
        updateTaskText,
        clearCompletedTasks, // This also moves completed tasks to 'cleared'
    } = useTasks();

    // Local state for UI interactions (not directly related to global tasks array)
    const [newTaskText, setNewTaskText] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
    const [sortBy, setSortBy] = useState('latest'); // 'latest', 'oldest', 'alpha'
    const [editTaskId, setEditTaskId] = useState(null); // ID of the task being edited
    const [editTaskText, setEditTaskText] = useState(''); // Text for the task being edited
    const [searchQuery, setSearchQuery] = useState(''); // Text for search input

    // --- Event Handlers for Task Operations ---

    const handleAddTask = (e) => {
        e.preventDefault(); // Prevent page reload on form submission
        if (newTaskText.trim() === '') {
            alert("Task text cannot be empty!"); // Simple validation
            return;
        }
        addTask(newTaskText); // Use context's addTask function
        setNewTaskText(''); // Clear the input field
    };

    const handleToggleStatus = (id) => {
        toggleTaskStatus(id); // Use context's toggleTaskStatus function
    };

    const handleDeleteTask = (id) => {
        // This performs a "soft delete" by changing status to 'cleared'
        softDeleteTask(id); // Use context's softDeleteTask function
    };

    const handleEditClick = (task) => {
        setEditTaskId(task.id);
        setEditTaskText(task.text);
    };

    const handleEditSave = (id) => {
        if (editTaskText.trim() === '') {
            alert("Task text cannot be empty!"); // Simple validation
            return;
        }
        updateTaskText(id, editTaskText); // Use context's updateTaskText function
        setEditTaskId(null); // Exit edit mode
        setEditTaskText(''); // Clear edit input
    };

    const handleEditCancel = () => {
        setEditTaskId(null); // Exit edit mode
        setEditTaskText(''); // Clear edit input
    };

    const handleClearCompleted = () => {
        // This moves all tasks with status 'completed' to 'cleared'
        clearCompletedTasks(); // Use context's clearCompletedTasks function
    };

    // --- Filtering and Sorting Logic (Derived State) ---

    const filteredTasks = tasks.filter(task => {
        // 1. Filter by status (exclude 'cleared' tasks from this page)
        const matchesFilter = (filter === 'all' && task.status !== 'cleared') ||
                              (filter === 'active' && task.status === 'active') ||
                              (filter === 'completed' && task.status === 'completed');

        // 2. Filter by search query (robustly handle potentially missing task.text)
        const taskText = typeof task.text === 'string' ? task.text : ''; // Ensure task.text is a string
        const matchesSearch = taskText.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'latest') {
            return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
        } else if (sortBy === 'oldest') {
            return new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
        } else if (sortBy === 'alpha') {
            // Robustly handle potentially missing task.text for alphabetical sort
            const aText = typeof a.text === 'string' ? a.text : '';
            const bText = typeof b.text === 'string' ? b.text : '';
            return aText.localeCompare(bText); // Alphabetical A-Z
        }
        return 0; // No sort change
    });


    // --- Component JSX Structure ---
    return (
        // Added 'page-container' for consistent padding/background from index.css
        <div className="tasks-container page-container">
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
                    <button type="submit" className="add-task-btn" disabled={newTaskText.trim() === ''}>
                        <span className="material-icons">add_task</span> Add Task
                    </button>
                </form>
            </section>

            {/* Task Controls (Filters, Sort, Search, Clear Completed) */}
            <section className="task-controls">
                <div className="filters">
                    <label>Filter:</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All (Active & Completed)</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        {/* 'cleared' tasks are handled in RecycleBinPage, not here */}
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
                <button onClick={handleClearCompleted} className="clear-completed-btn"
                        disabled={tasks.filter(task => task.status === 'completed').length === 0}>
                    <span className="material-icons">delete_outline</span> Clear Completed
                </button>
            </section>

            {/* Task List Section */}
            <section className="task-list-section">
                {sortedTasks.length === 0 ? (
                    // Conditional message based on current filter/search
                    <p className="no-tasks-message">
                        {filter === 'all' && searchQuery === '' && 'You have no tasks yet! Start by adding one above.'}
                        {filter === 'active' && searchQuery === '' && 'No active tasks. Time to relax or add more!'}
                        {filter === 'completed' && searchQuery === '' && 'No completed tasks. Get to work!'}
                        {searchQuery !== '' && 'No tasks found matching your search criteria.'}
                        {filter !== 'all' && searchQuery === '' && 'No tasks found for the selected filter.'}
                    </p>
                ) : (
                    <ul className="task-list">
                        {sortedTasks.map(task => (
                            <li key={task.id} className={`task-item ${task.status}`}>
                                {editTaskId === task.id ? (
                                    // Edit mode UI
                                    <div className="edit-mode">
                                        <input
                                            type="text"
                                            value={editTaskText}
                                            onChange={(e) => setEditTaskText(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') handleEditSave(task.id);
                                            }}
                                        />
                                        <button onClick={() => handleEditSave(task.id)} className="save-btn" disabled={editTaskText.trim() === ''}>
                                            <span className="material-icons">done</span>
                                        </button>
                                        <button onClick={handleEditCancel} className="cancel-btn">
                                            <span className="material-icons">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    // View mode UI
                                    <>
                                        <input
                                            type="checkbox"
                                            checked={task.status === 'completed'}
                                            onChange={() => handleToggleStatus(task.id)}
                                            className="task-checkbox"
                                        />
                                        <span className="task-text">{task.text}</span>
                                        <div className="task-actions">
                                            <button onClick={() => handleEditClick(task)} className="edit-btn">
                                                <span className="material-icons">edit</span>
                                            </button>
                                            <button onClick={() => handleDeleteTask(task.id)} className="delete-btn">
                                                <span className="material-icons">delete</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default TasksPage;