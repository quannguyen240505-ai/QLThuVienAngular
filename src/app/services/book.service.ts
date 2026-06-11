import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly apiUrl = 'https://localhost:7067/api/Books';

  constructor(private http: HttpClient) {}

  getBooks() {
    return this.http.get<any[]>(this.apiUrl);
  }
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BookService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private apiUrl = 'https://localhost:7067/api/books';

    private getHeaders(): HttpHeaders {
        const token = this.auth.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    getAll(): Observable<Book[]> {
        return this.http.get<Book[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    getById(id: number): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    create(book: Book): Observable<Book> {
        return this.http.post<Book>(this.apiUrl, book, { headers: this.getHeaders() });
    }

    update(id: number, book: Book): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, book, { headers: this.getHeaders() });
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}