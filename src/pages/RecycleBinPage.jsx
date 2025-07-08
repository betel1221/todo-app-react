import React from 'react';
import { useTasks } from '../context/TasksContext'; // Import useTasks hook
import './RecycleBinPage.css';

const RecycleBinPage = () => {
    const { tasks, restoreTask, permanentDeleteTask } = useTasks(); // Use the tasks context

    // Filter tasks from the global context to show only cleared ones
    const clearedTasks = tasks.filter(task => task.status === 'cleared');

    const handleRestoreTask = (id) => {
        restoreTask(id); // Use context's restoreTask
    };

    const handlePermanentDelete = (id) => {
        permanentDeleteTask(id); // Use context's permanentDeleteTask
    };

    return (
        <div className="recycle-bin-container">
            <h1 className="page-title">Recycle Bin</h1>

            {clearedTasks.length === 0 ? (
                <p className="no-tasks-message">
                    Recycle Bin is empty. Nothing to restore or permanently delete.
                </p>
            ) : (
                <ul className="task-list">
                    {clearedTasks.map(task => (
                        <li key={task.id} className="task-item cleared">
                            <span className="task-text">{task.text}</span>
                            <div className="task-actions">
                                <button onClick={() => handleRestoreTask(task.id)} className="restore-btn">
                                    <span className="material-icons">restore_from_trash</span> Restore
                                </button>
                                <button onClick={() => handlePermanentDelete(task.id)} className="permanent-delete-btn">
                                    <span className="material-icons">delete_forever</span> Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default RecycleBinPage;