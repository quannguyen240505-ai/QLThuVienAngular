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
}