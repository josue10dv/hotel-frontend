import { HttpNotificationRepository } from '../repositories/HttpNotificationRepository';
import { NotificationRepository } from '../../domain/repositories/NotificationRepository';

class NotificationService {
    private repository: NotificationRepository;

    constructor() {
        this.repository = new HttpNotificationRepository();
    }

    getRepository(): NotificationRepository {
        return this.repository;
    }
}

export const notificationService = new NotificationService();
