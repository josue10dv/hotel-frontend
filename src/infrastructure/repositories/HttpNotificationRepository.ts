import { httpClient } from '../api/HttpClient';
import { API_ENDPOINTS } from '../../config/api.config';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';
import { NotificationListResponse } from '../../domain/entities/Notification';

export class HttpNotificationRepository implements NotificationRepository {
    async getNotifications(
        unreadOnly: boolean = false,
        page: number = 1,
        pageSize: number = 20
    ): Promise<NotificationListResponse> {
        const params: any = { page, page_size: pageSize };
        if (unreadOnly) {
            params.unread_only = true;
        }

        return await httpClient.get<NotificationListResponse>(API_ENDPOINTS.notifications.list, { params });
    }

    async markAsRead(notificationId: string): Promise<void> {
        await httpClient.patch(API_ENDPOINTS.notifications.markAsRead(notificationId), null);
    }

    async markAllAsRead(): Promise<{ count: number }> {
        return await httpClient.post<{ count: number }>(API_ENDPOINTS.notifications.markAllAsRead, null);
    }

    async deleteNotification(notificationId: string): Promise<void> {
        await httpClient.delete(API_ENDPOINTS.notifications.delete(notificationId));
    }
}
