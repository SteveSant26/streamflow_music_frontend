import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notifications = signal<Notification[]>([]);

  getNotifications() {
    return this.notifications.asReadonly();
  }

  showSuccess(message: string, duration = 3000) {
    this.addNotification({ message, type: 'success', duration });
  }

  showError(message: string, duration = 5000) {
    this.addNotification({ message, type: 'error', duration });
  }

  showInfo(message: string, duration = 4000) {
    this.addNotification({ message, type: 'info', duration });
  }

  showWarning(message: string, duration = 4000) {
    this.addNotification({ message, type: 'warning', duration });
  }

  private addNotification(notification: Notification) {
    const currentNotifications = this.notifications();
    this.notifications.set([...currentNotifications, notification]);

    // Auto-remove notification after duration
    if (notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification);
      }, notification.duration);
    }
  }

  removeNotification(notificationToRemove: Notification) {
    const currentNotifications = this.notifications();
    this.notifications.set(
      currentNotifications.filter((n) => n !== notificationToRemove),
    );
  }

  clearAll() {
    this.notifications.set([]);
  }
}
