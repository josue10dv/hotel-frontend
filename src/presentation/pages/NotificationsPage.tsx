import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../infrastructure/services/NotificationService';
import { Notification as NotificationEntity } from '../../domain/entities/Notification';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export function NotificationsPage() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchNotifications();
    }, [filter, page]);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const result = await notificationService.getRepository().getNotifications(
                filter === 'unread',
                page,
                20
            );
            setNotifications(result.results);
            setUnreadCount(result.unread_count);
            setTotalPages(result.total_pages);
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.getRepository().markAsRead(id);
            await fetchNotifications();
        } catch (error: any) {
            alert(error.message || 'Error al marcar como leída');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.getRepository().markAllAsRead();
            await fetchNotifications();
        } catch (error: any) {
            alert(error.message || 'Error al marcar todas como leídas');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta notificación?')) {
            return;
        }

        try {
            await notificationService.getRepository().deleteNotification(id);
            await fetchNotifications();
        } catch (error: any) {
            alert(error.message || 'Error al eliminar notificación');
        }
    };

    const handleNotificationClick = (notification: NotificationEntity) => {
        if (!notification.read) {
            handleMarkAsRead(notification.id);
        }

        // Navigate based on notification type
        if (notification.data.reservation_id) {
            navigate(`/reservations`);
        } else if (notification.data.hotel_id) {
            navigate(`/listing/${notification.data.hotel_id}`);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getNotificationIcon = (type: string) => {
        const icons: Record<string, string> = {
            reservation: '🏨',
            payment: '💳',
            review: '⭐',
            system: '🔔',
        };
        return icons[type] || '🔔';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Bell className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
                                <p className="text-gray-600">
                                    {unreadCount > 0
                                        ? `Tienes ${unreadCount} ${unreadCount === 1 ? 'notificación no leída' : 'notificaciones no leídas'}`
                                        : 'Todas las notificaciones están leídas'}
                                </p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setFilter('all');
                                setPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => {
                                setFilter('unread');
                                setPage(1);
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'unread'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            No leídas ({unreadCount})
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {filter === 'unread' ? 'No tienes notificaciones no leídas' : 'No tienes notificaciones'}
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'unread'
                                ? 'Todas tus notificaciones han sido leídas'
                                : 'Cuando recibas notificaciones aparecerán aquí'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-blue-600' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">{getNotificationIcon(notification.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            onClick={() => handleNotificationClick(notification)}
                                            className="cursor-pointer"
                                        >
                                            <h3 className="font-semibold text-gray-900 mb-1">{notification.title}</h3>
                                            <p className="text-gray-600 mb-2">{notification.message}</p>
                                            <p className="text-sm text-gray-400">{formatDate(notification.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Marcar como leída"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>
                        <span className="px-4 py-2 text-gray-700">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
