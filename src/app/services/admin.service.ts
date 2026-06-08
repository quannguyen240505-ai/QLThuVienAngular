import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserResponse } from '../models/user-response';
import { CreateUserRequest } from '../models/create-user-request';
import { UpdateUserRequest } from '../models/update-user-request';
import { AdminResetUserPasswordRequest } from '../models/admin-reset-user-password-request';
import { LibrarySettingResponse } from '../models/library-setting-response';
import { UpdateLibrarySettingRequest } from '../models/update-library-setting-request';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  private readonly apiBaseUrl = 'https://localhost:7067/api';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') ?? '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

getUsers(): Observable<UserResponse[]> {
  return this.http.get<UserResponse[]>(
    `${this.apiBaseUrl}/Admin/users`,
    {
      headers: this.getAuthHeaders()
    }
  );
}

createUser(data: CreateUserRequest): Observable<string> {
  return this.http.post(
    `${this.apiBaseUrl}/Admin/users`,
    data,
    {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }
  );
}

updateUser(id: number, data: UpdateUserRequest): Observable<string> {
  return this.http.put(
    `${this.apiBaseUrl}/Admin/users/${id}`,
    data,
    {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }
  );
}

deleteUser(id: number): Observable<string> {
  return this.http.delete(
    `${this.apiBaseUrl}/Admin/users/${id}`,
    {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }
  );
}

updateUserRole(id: number, role: string): Observable<string> {
  return this.http.put(
    `${this.apiBaseUrl}/Admin/users/${id}/role`,
    { role },
    {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }
  );
}

updateUserStatus(id: number, isActive: boolean): Observable<string> {
  return this.http.put(
    `${this.apiBaseUrl}/Admin/users/${id}/status`,
    { isActive },
    {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }
  );
}

resetUserPassword(id: number, data: AdminResetUserPasswordRequest): Observable<string> {
  return this.http.put(
    `${this.apiBaseUrl}/Admin/users/${id}/password`,
    data,
    {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }
  );
}

  getSettings(): Observable<LibrarySettingResponse> {
    return this.http.get<LibrarySettingResponse>(
      `${this.apiBaseUrl}/System/settings`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  updateSettings(data: UpdateLibrarySettingRequest): Observable<string> {
    return this.http.put(
      `${this.apiBaseUrl}/System/settings`,
      data,
      {
        headers: this.getAuthHeaders(),
        responseType: 'text'
      }
    );
  }

  getPublicSettings(): Observable<LibrarySettingResponse> {
    return this.http.get<LibrarySettingResponse>(
      `${this.apiBaseUrl}/System/settings-public`
    );
  }
}