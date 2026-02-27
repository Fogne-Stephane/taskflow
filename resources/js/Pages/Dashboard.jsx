import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Stats from '../Components/Stats';
import TaskList from '../Components/TaskList';
import TaskForm from '../Components/TaskForm';
import Header from '../Components/Header';

export default function Dashboard() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        high_priority: 0
    });
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, completed, pending, high

    useEffect(() => {
        fetchTasks();
        fetchStats();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/tasks');
            setTasks(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleTaskCreated = () => {
        setShowForm(false);
        fetchTasks();
        fetchStats();
    };

    const handleTaskUpdated = () => {
        setEditingTask(null);
        fetchTasks();
        fetchStats();
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    // Filter tasks based on selected filter
    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'pending') return !task.completed;
        if (filter === 'high') return task.priority === 'high';
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Section */}
                <Stats stats={stats} />
                
                {/* Filters and Add Task Button */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                                filter === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            All Tasks
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                                filter === 'pending' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                                filter === 'completed' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => setFilter('high')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                                filter === 'high' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            High Priority
                        </button>
                    </div>
                    
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {showForm ? 'Cancel' : '+ Add New Task'}
                    </button>
                </div>

                {/* Task Form Modal */}
                {showForm && (
                    <div className="mt-6">
                        <TaskForm
                            task={editingTask}
                            onSuccess={editingTask ? handleTaskUpdated : handleTaskCreated}
                            onCancel={handleCancel}
                        />
                    </div>
                )}

                {/* Tasks List */}
                <div className="mt-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading tasks...</p>
                        </div>
                    ) : (
                        <TaskList
                            tasks={filteredTasks}
                            onTaskUpdated={fetchTasks}
                            onEdit={handleEdit}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}