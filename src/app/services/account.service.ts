import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AuthResponse } from '../models/auth-response';
import { AccountProfileResponse } from '../models/account-profile-response';
import { UpdateProfileRequest } from '../models/update-profile-request';
import { ChangePasswordRequest } from '../models/change-password-request';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly apiUrl = 'https://localhost:7067/api/Account';

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getMyProfile() {
    return this.http.get<AccountProfileResponse>(`${this.apiUrl}/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProfile(data: UpdateProfileRequest) {
    return this.http.put<AuthResponse>(`${this.apiUrl}/profile`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.put(`${this.apiUrl}/change-password`, data, {
      headers: this.getAuthHeaders(),
      responseType: 'text',
    });
  }
}
