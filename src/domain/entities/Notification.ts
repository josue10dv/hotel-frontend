export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    data: Record<string, any>;
    read: boolean;
    created_at: string;
    read_at: string | null;
}

export type NotificationType = 'reservation' | 'payment' | 'review' | 'system';

export interface NotificationListResponse {
    count: number;
    unread_count: number;
    page: number;
    page_size: number;
    total_pages: number;
    results: Notification[];
}
