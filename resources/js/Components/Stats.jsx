import React from 'react';

export default function Stats({ stats }) {
    const statCards = [
        { label: 'Total Tasks', value: stats.total, color: 'bg-blue-500', icon: '📋' },
        { label: 'Completed', value: stats.completed, color: 'bg-green-500', icon: '✅' },
        { label: 'Pending', value: stats.pending, color: 'bg-yellow-500', icon: '⏳' },
        { label: 'High Priority', value: stats.high_priority, color: 'bg-red-500', icon: '⚠️' }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className={`${stat.color} rounded-lg p-3 text-white text-2xl`}>
                            {stat.icon}
                        </div>
                        <div className="ml-4">
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}