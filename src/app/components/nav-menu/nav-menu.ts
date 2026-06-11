import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.css'
})
export class NavMenuComponent implements OnInit, OnDestroy {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  role = '';
  isLoggedIn = false;
  isDarkMode = false;

  private authSub?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  get isAdmin(): boolean {
    return this.role === 'Admin';
  }

  get isLibrarianOrAdmin(): boolean {
    return this.role === 'Librarian' || this.role === 'Admin';
  }

  get isMemberOrHigher(): boolean {
    return this.role === 'Member' || this.role === 'Librarian' || this.role === 'Admin';
  }
  isBookDetailRoute(): boolean {
    // Kiểm tra nếu route hiện tại bắt đầu bằng /books/ và không phải chính xác /books
    return this.router.url.startsWith('/books/') && this.router.url !== '/books';
  }

  ngOnInit(): void {
    this.loadLoginStatus();
    this.loadTheme();

    this.authSub = this.authService.authState$.subscribe(() => {
      this.loadLoginStatus();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }

  logout(): void {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');

    if (!isConfirmed) {
      return;
    }
    this.authService.logout();
    this.loadLoginStatus();
    this.router.navigate(['/']);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  private loadLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();

    if (this.isLoggedIn) {
      this.role = this.authService.getRole();
    } else {
      this.role = '';
    }
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
    } else {
      this.isDarkMode = false;
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }
}