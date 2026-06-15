import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthResponse } from '../models/auth-response';
import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { ForgotPasswordRequest } from '../models/forgot-password-request';
import { ResetPasswordRequest } from '../models/reset-password-request';
import { ExchangeSocialCodeRequest } from '../models/exchange-social-code-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7067/api/Auth';

  private authStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  saveAuthData(result: AuthResponse): void {
    localStorage.setItem('authToken', result.token);
    localStorage.setItem('username', result.username);
    localStorage.setItem('gmail', result.gmail);
    localStorage.setItem('role', result.role);
    localStorage.setItem('tokenExpiration', result.expiration);
    this.authStateSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('gmail');
    localStorage.removeItem('role');
    localStorage.removeItem('tokenExpiration');
    this.authStateSubject.next(false);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');
    const expirationText = localStorage.getItem('tokenExpiration');
    if (!token || !expirationText) return false;
    const expiration = new Date(expirationText);
    if (isNaN(expiration.getTime()) || new Date() >= expiration) return false;
    return true;
  }

  getToken(): string {
    return localStorage.getItem('authToken') ?? '';
  }

  getUsername(): string {
    return localStorage.getItem('username') ?? '';
  }

  getRole(): string {
    return localStorage.getItem('role') ?? '';
  }

  getCurrentUser(): { username: string; gmail: string; role: string } | null {
    if (!this.isLoggedIn()) return null;
    return {
      username: this.getUsername(),
      gmail: localStorage.getItem('gmail') ?? '',
      role: this.getRole()
    };
  }

  hasRole(role: string): boolean {
    const userRole = this.getRole();
    return userRole === role;
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google-login`;
  }
  exchangeSocialCode(data: ExchangeSocialCodeRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/exchange-social-code`, data);
  }

  forgotPassword(data: ForgotPasswordRequest) {
    return this.http.post(`${this.apiUrl}/forgot-password`, data, {
      responseType: 'text',
    });
  }

  resetPassword(data: ResetPasswordRequest) {
    return this.http.post(`${this.apiUrl}/reset-password`, data, {
      responseType: 'text',
    });
  }
}
