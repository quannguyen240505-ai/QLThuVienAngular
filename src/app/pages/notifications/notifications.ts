import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);

  notifications: AppNotification[] = [];
  loading = true;
  errorMessage = '';

  private refreshInterval?: number;
  private timeInterval?: number;

  now = new Date();

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(data => {
      this.notifications = data;
    });

    this.loadNotifications();

    // Cứ 10 giây kiểm tra thông báo mới
    this.refreshInterval = window.setInterval(() => {
      this.loadNotifications(false);
    }, 10000);

    // Cứ 30 giây cập nhật text "vừa xong", "5 phút trước"
    this.timeInterval = window.setInterval(() => {
      this.now = new Date();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      window.clearInterval(this.refreshInterval);
    }

    if (this.timeInterval) {
      window.clearInterval(this.timeInterval);
    }
  }

  loadNotifications(showLoading = true): void {
    if (showLoading) {
      this.loading = true;
    }

    this.errorMessage = '';

    this.notificationService.loadNotifications().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        console.error('Lỗi tải thông báo:', err);
        this.loading = false;
        this.errorMessage = 'Không thể tải thông báo. Kiểm tra BE hoặc API.';
      }
    });
  }

  markAsRead(notification: AppNotification): void {
    if (notification.isRead) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      error: (err) => {
        console.error('Lỗi đánh dấu đã đọc:', err);
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      error: (err) => {
        console.error('Lỗi đánh dấu tất cả đã đọc:', err);
      }
    });
  }

  getUnreadCount(): number {
    return this.notifications.filter(item => !item.isRead).length;
  }

  getTimeAgo(dateText: string): string {
    const createdAt = new Date(dateText);
    const diffMs = this.now.getTime() - createdAt.getTime();

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'Vừa xong';
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} phút trước`;
    }

    if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    }

    if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    }

    return createdAt.toLocaleString('vi-VN');
  }
}