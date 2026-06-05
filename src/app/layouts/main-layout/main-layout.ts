import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '../../components/nav-menu/nav-menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavMenuComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isLoggedIn = false;
  username = '';
  role = '';

  private tokenInterval?: number;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
    this.startTokenChecker();
  }

  ngOnDestroy(): void {
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
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  getAvatarText(): string {
    if (!this.username.trim()) {
      return 'U';
    }

    return this.username.substring(0, 1).toUpperCase();
  }

  private loadUserFromLocalStorage(): void {
    const token = localStorage.getItem('authToken');
    const expirationText = localStorage.getItem('tokenExpiration');

    if (!token || !expirationText) {
      this.clearUserState();
      return;
    }

    const expiration = new Date(expirationText);

    if (Number.isNaN(expiration.getTime()) || new Date() >= expiration) {
      this.handleTokenExpired();
      return;
    }

    this.username = localStorage.getItem('username') ?? '';
    this.role = localStorage.getItem('role') ?? '';
    this.isLoggedIn = true;
  }

  private startTokenChecker(): void {
    this.tokenInterval = window.setInterval(() => {
      if (!this.isLoggedIn) {
        return;
      }

      const expirationText = localStorage.getItem('tokenExpiration');

      if (!expirationText) {
        this.handleTokenExpired();
        return;
      }

      const expiration = new Date(expirationText);

      if (Number.isNaN(expiration.getTime()) || new Date() >= expiration) {
        this.handleTokenExpired();
      }
    }, 10000);
  }

  private handleTokenExpired(): void {
    this.clearAuthData();
    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    this.router.navigate(['/login']);
  }

  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('gmail');
    localStorage.removeItem('role');
    localStorage.removeItem('tokenExpiration');

    this.clearUserState();
  }

  private clearUserState(): void {
    this.isLoggedIn = false;
    this.username = '';
    this.role = '';
  }
}