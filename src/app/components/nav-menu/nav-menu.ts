import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.css'
})
export class NavMenuComponent implements OnInit {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  role = '';
  isLoggedIn = false;
  isDarkMode = false;

  constructor(private router: Router) {}

  get isAdmin(): boolean {
    return this.role === 'Admin';
  }

  get isLibrarianOrAdmin(): boolean {
    return this.role === 'Librarian' || this.role === 'Admin';
  }

  get isMemberOrHigher(): boolean {
    return this.role === 'Member' || this.role === 'Librarian' || this.role === 'Admin';
  }

  ngOnInit(): void {
    this.checkLoginStatus();

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

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private checkLoginStatus(): void {
    const token = localStorage.getItem('authToken');
    const expirationText = localStorage.getItem('tokenExpiration');

    if (!token || !expirationText) {
      this.role = '';
      this.isLoggedIn = false;
      return;
    }

    const expiration = new Date(expirationText);

    if (Number.isNaN(expiration.getTime()) || new Date() >= expiration) {
      this.clearAuthData();
      return;
    }

    this.role = localStorage.getItem('role') ?? '';
    this.isLoggedIn = true;
  }

  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('gmail');
    localStorage.removeItem('role');
    localStorage.removeItem('tokenExpiration');

    this.role = '';
    this.isLoggedIn = false;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    console.log('Dark mode:', this.isDarkMode);

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
}