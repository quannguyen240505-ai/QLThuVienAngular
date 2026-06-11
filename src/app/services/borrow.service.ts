import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BorrowRequest } from '../models/borrow';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7067/api/Borrow';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') ?? '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  sendBorrowRequest(data: BorrowRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/request`, data, {
      headers: this.getHeaders()
    });
  }

  getBorrowHistory(): Observable<any[]> {
    const role = localStorage.getItem('role') ?? '';

    if (role === 'Admin' || role === 'Librarian') {
      return this.http.get<any[]>(`${this.apiUrl}/history`, {
        headers: this.getHeaders()
      });
    }

    return this.http.get<any[]>(`${this.apiUrl}/my-history`, {
      headers: this.getHeaders()
    });
  }

  getAllBorrowHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`, {
      headers: this.getHeaders()
    });
  }

  getMyBorrowHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-history`, {
      headers: this.getHeaders()
    });
  }

  approveBorrow(ticketId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}/approve`, null, {
      headers: this.getHeaders()
    });
  }

  returnBook(ticketId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}/return`, null, {
      headers: this.getHeaders()
    });
  }

  getMyBorrowing(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-borrowing`, {
      headers: this.getHeaders()
    });
  }

  memberReturn(ticketId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${ticketId}/member-return`, null, {
      headers: this.getHeaders()
    });
  }

  getOverdueBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/overdue`, {
      headers: this.getHeaders()
    });
  }
}