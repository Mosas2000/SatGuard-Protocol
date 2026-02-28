import { useState } from 'react';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
}

interface UserNotificationsProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onClearAll: () => void;
}

export default function UserNotifications({ notifications, onMarkAsRead, onClearAll }: UserNotificationsProps) {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const filteredNotifications = notifications.filter(
        n => filter === 'all' || !n.read
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return '✅';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            default: return 'ℹ️';
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200';
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            case 'error': return 'bg-red-50 border-red-200';
            default: return 'bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-black">
                        Notifications {unreadCount > 0 && (
                            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h3>
                    <button
                        onClick={onClearAll}
                        className="text-sm text-gray-600 hover:text-black"
                    >
                        Clear All
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded ${
                            filter === 'all' ? 'bg-stacks-orange text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded ${
                            filter === 'unread' ? 'bg-stacks-orange text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        Unread
                    </button>
                </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No notifications
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 flex items-start gap-3 ${
                                    !notification.read ? 'bg-blue-50' : ''
                                }`}
                            >
                                <div className="text-2xl">{getIcon(notification.type)}</div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-black">{notification.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                {!notification.read && (
                                    <button
                                        onClick={() => onMarkAsRead(notification.id)}
                                        className="text-xs text-stacks-orange hover:underline"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
