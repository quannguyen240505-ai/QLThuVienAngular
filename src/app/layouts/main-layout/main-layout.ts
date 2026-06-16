import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { NavMenuComponent } from '../../components/nav-menu/nav-menu';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavMenuComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isLoggedIn = false;
  username = '';
  role = '';

  unreadCount = 0;

  private authSub?: Subscription;
  private notificationSub?: Subscription;
  private tokenInterval?: number;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();

    this.authSub = this.authService.authState$.subscribe(() => {
      this.loadUserFromLocalStorage();
      this.loadUnreadNotificationCount();
    });

    this.notificationSub = this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });

    this.loadUnreadNotificationCount();
    this.startTokenChecker();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.notificationSub?.unsubscribe();

    if (this.tokenInterval) {
      window.clearInterval(this.tokenInterval);
    }
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');

    if (!isConfirmed) {
      return;
    }

    this.authService.logout();
    this.loadUserFromLocalStorage();
    this.unreadCount = 0;
    this.router.navigate(['/']);
  }

  getAvatarText(): string {
    if (!this.username.trim()) {
      return 'U';
    }

    return this.username.substring(0, 1).toUpperCase();
  }

  private loadUserFromLocalStorage(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.username = this.authService.getUsername();
      this.role = this.authService.getRole();
    } else {
      this.username = '';
      this.role = '';
    }
  }

  private loadUnreadNotificationCount(): void {
    if (!this.isLoggedIn) {
      this.unreadCount = 0;
      return;
    }

    this.notificationService.loadUnreadCount().subscribe({
      error: err => {
        console.error('Lỗi tải số thông báo chưa đọc:', err);
      }
    });
  }
  openNotifications(): void {
  this.router.navigateByUrl('/notifications').then(() => {
    this.notificationService.loadNotifications().subscribe({
      error: err => {
        console.error('Lỗi tải thông báo:', err);
      }
    });

    this.notificationService.loadUnreadCount().subscribe({
      error: err => {
        console.error('Lỗi tải số thông báo:', err);
      }
    });
  });
}

  private startTokenChecker(): void {
    this.tokenInterval = window.setInterval(() => {
      if (!this.isLoggedIn) {
        return;
      }

      if (!this.authService.isLoggedIn()) {
        this.authService.logout();
        this.loadUserFromLocalStorage();
        this.unreadCount = 0;
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        this.router.navigate(['/login']);
      }
    }, 10000);
  }
}