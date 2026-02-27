import React from 'react';
import axios from 'axios';

export default function TaskList({ tasks, onTaskUpdated, onEdit }) {
    const toggleComplete = async (task) => {
        try {
            await axios.put(`/api/tasks/${task.id}`, {
                completed: !task.completed
            });
            onTaskUpdated();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`/api/tasks/${id}`);
                onTaskUpdated();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const priorityColors = {
        low: 'bg-green-100 text-green-800 border-green-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        high: 'bg-red-100 text-red-800 border-red-200'
    };

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600">Click "Add New Task" to create your first task!</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map(task => (
                <div
                    key={task.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleComplete(task)}
                                className="mt-1 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                            />
                            
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className={`font-semibold text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                        {task.title}
                                    </h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                                        {task.priority}
                                    </span>
                                </div>
                                
                                {task.description && (
                                    <p className={`mt-1 text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {task.description}
                                    </p>
                                )}
                                
                                <p className="text-xs text-gray-400 mt-2">
                                    Created: {new Date(task.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                            <button
                                onClick={() => onEdit(task)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                title="Edit task"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                title="Delete task"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}