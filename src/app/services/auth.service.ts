import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthResponse } from '../models/auth-response';
import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { ForgotPasswordRequest } from '../models/forgot-password-request';
import { ResetPasswordRequest } from '../models/reset-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7067/api/Auth';

  private authStateSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  authState$ = this.authStateSubject.asObservable();

  constructor(private http: HttpClient) {}

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

    if (!token || !expirationText) {
      return false;
    }

    const expiration = new Date(expirationText);

    if (Number.isNaN(expiration.getTime()) || new Date() >= expiration) {
      return false;
    }

    return true;
  }

  getUsername(): string {
    return localStorage.getItem('username') ?? '';
  }

  getRole(): string {
    return localStorage.getItem('role') ?? '';
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/google-login`;
  }

  forgotPassword(data: ForgotPasswordRequest) {
      return this.http.post(`${this.apiUrl}/forgot-password`, data, {
      responseType: 'text'
    });
  }

  resetPassword(data: ResetPasswordRequest) {
      return this.http.post(`${this.apiUrl}/reset-password`, data, {
      responseType: 'text'
    });
  }
}