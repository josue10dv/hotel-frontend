import { Notification, NotificationListResponse } from '../entities/Notification';

export interface NotificationRepository {
    getNotifications(unreadOnly?: boolean, page?: number, pageSize?: number): Promise<NotificationListResponse>;
    markAsRead(notificationId: string): Promise<void>;
    markAllAsRead(): Promise<{ count: number }>;
    deleteNotification(notificationId: string): Promise<void>;
}
