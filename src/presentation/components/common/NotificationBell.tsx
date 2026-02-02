import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../../infrastructure/services/NotificationService';
import { Notification as NotificationEntity } from '../../../domain/entities/Notification';

export function NotificationBell() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const fetchNotifications = async () => {
        try {
            const result = await notificationService.getRepository().getNotifications(false, 1, 5);
            setNotifications(result.results);
            setUnreadCount(result.unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        setIsLoading(true);
        try {
            await notificationService.getRepository().markAllAsRead();
            await fetchNotifications();
        } catch (error: any) {
            alert(error.message || 'Error al marcar notificaciones');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationClick = async (notification: NotificationEntity) => {
        if (!notification.read) {
            try {
                await notificationService.getRepository().markAsRead(notification.id);
                await fetchNotifications();
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }

        setShowDropdown(false);

        // Navigate based on notification type
        if (notification.data.reservation_id) {
            navigate(`/reservations`);
        } else if (notification.data.hotel_id) {
            navigate(`/listing/${notification.data.hotel_id}`);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        return `Hace ${diffDays}d`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                disabled={isLoading}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No tienes notificaciones</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? 'bg-blue-600' : 'bg-transparent'}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                                {notification.title}
                                            </p>
                                            <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {formatTimeAgo(notification.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    navigate('/notifications');
                                }}
                                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Ver todas las notificaciones
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
