import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private readonly apiUrl = 'https://localhost:7067/api/Borrow';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') ?? '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  sendBorrowRequest(data: any) {
    return this.http.post(`${this.apiUrl}/request`, data, {
      headers: this.getHeaders()
    });
  }

  getHistory() {
    return this.http.get(`${this.apiUrl}/history`, {
      headers: this.getHeaders()
    });
  }

  getMyBorrowing() {
    return this.http.get(`${this.apiUrl}/my-borrowing`, {
      headers: this.getHeaders()
    });
  }

  memberReturn(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/member-return`, null, {
      headers: this.getHeaders()
    });
  }

  getAllBorrows() {
    return this.http.get(`${this.apiUrl}/history`, {
      headers: this.getHeaders()
    });
  }

  approveBorrow(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/approve`, null, {
      headers: this.getHeaders()
    });
  }

  returnBook(id: number) {
    return this.http.put(`${this.apiUrl}/${id}/return`, null, {
      headers: this.getHeaders()
    });
  }

  getOverdueBooks() {
    return this.http.get(`${this.apiUrl}/overdue`, {
      headers: this.getHeaders()
    });
  }
}