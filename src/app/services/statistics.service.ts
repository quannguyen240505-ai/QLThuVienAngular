import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityStatisticsResponse } from '../models/statistics';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private apiUrl = 'https://localhost:7067/api/Statistics'; // Thay cổng backend của bạn

    private getHeaders(): HttpHeaders {
        const token = this.auth.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    getActivityStatistics(): Observable<ActivityStatisticsResponse> {
        return this.http.get<ActivityStatisticsResponse>(`${this.apiUrl}/activity`, { headers: this.getHeaders() });
    }
}