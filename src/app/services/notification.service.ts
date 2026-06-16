import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AppNotification, UnreadCountResponse } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7067/api/Notifications';

  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  loadNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.apiUrl).pipe(
      tap(data => {
        this.notificationsSubject.next(data);
        this.updateUnreadCountFromList(data);
      })
    );
  }

  loadUnreadCount(): Observable<UnreadCountResponse> {
    return this.http.get<UnreadCountResponse>(`${this.apiUrl}/unread-count`).pipe(
      tap(res => {
        this.unreadCountSubject.next(res.unreadCount);
      })
    );
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        const updatedList = this.notificationsSubject.value.map(item =>
          item.id === id ? { ...item, isRead: true } : item
        );

        this.notificationsSubject.next(updatedList);
        this.updateUnreadCountFromList(updatedList);
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        const updatedList = this.notificationsSubject.value.map(item => ({
          ...item,
          isRead: true
        }));

        this.notificationsSubject.next(updatedList);
        this.unreadCountSubject.next(0);
      })
    );
  }

  private updateUnreadCountFromList(list: AppNotification[]): void {
    const count = list.filter(item => !item.isRead).length;
    this.unreadCountSubject.next(count);
  }
}