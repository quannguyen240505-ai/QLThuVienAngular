import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import { NavMenuComponent } from '../../components/nav-menu/nav-menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavMenuComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isLoggedIn = false;
  username = '';
  role = '';

  private authSub?: Subscription;
  private tokenInterval?: number;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();

    this.authSub = this.authService.authState$.subscribe(() => {
      this.loadUserFromLocalStorage();
    });

    this.startTokenChecker();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();

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

  private startTokenChecker(): void {
    this.tokenInterval = window.setInterval(() => {
      if (!this.isLoggedIn) {
        return;
      }

      if (!this.authService.isLoggedIn()) {
        this.authService.logout();
        this.loadUserFromLocalStorage();
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        this.router.navigate(['/login']);
      }
    }, 10000);
  }
}
