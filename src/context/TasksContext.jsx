import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const TasksContext = createContext();

// Custom hook to use the tasks context
export const useTasks = () => {
    return useContext(TasksContext);
};

// Tasks Provider Component
export const TasksProvider = ({ children }) => {
    // Get tasks from localStorage on initial render
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        try {
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch (error) {
            console.error("Failed to parse tasks from localStorage:", error);
            return []; // Return empty array if parsing fails
        }
    });

    // Effect to save tasks to localStorage whenever the 'tasks' state changes
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]); // Rerun whenever the tasks state changes

    // --- Task Management Functions (Centralized) ---

    const addTask = (text) => {
        if (text.trim() === '') return;
        const newTask = {
            id: Date.now(), // Simple unique ID
            text: text.trim(),
            status: 'active', // 'active', 'completed', 'cleared'
            createdAt: new Date().toISOString(),
            completedAt: null,
            deletedAt: null,
        };
        setTasks((prevTasks) => [newTask, ...prevTasks]);
    };

    const toggleTaskStatus = (id) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        status: task.status === 'completed' ? 'active' : 'completed',
                        completedAt: task.status === 'completed' ? null : new Date().toISOString(),
                    }
                    : task
            )
        );
    };

    const softDeleteTask = (id) => {
        // Move to 'cleared' status (Recycle Bin)
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, status: 'cleared', deletedAt: new Date().toISOString() } : task
            )
        );
    };

    const updateTaskText = (id, newText) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, text: newText.trim() } : task
            )
        );
    };

    const restoreTask = (id) => {
        // Restore from cleared to active
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, status: 'active', deletedAt: null } : task
            )
        );
    };

    const permanentDeleteTask = (id) => {
        // Permanently remove from the array
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    const clearCompletedTasks = () => {
        // Moves all completed tasks to 'cleared' status
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.status === 'completed' ? { ...task, status: 'cleared', deletedAt: new Date().toISOString() } : task
            )
        );
    };


    const value = {
        tasks, // The array of all tasks
        addTask,
        toggleTaskStatus,
        softDeleteTask,
        updateTaskText,
        restoreTask,
        permanentDeleteTask,
        clearCompletedTasks,
    };

    return (
        <TasksContext.Provider value={value}>
            {children}
        </TasksContext.Provider>
    );
};