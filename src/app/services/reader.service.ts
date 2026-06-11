import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReaderService {
  private readonly apiUrl = 'https://localhost:7067/api/Readers';

  constructor(private http: HttpClient) {}

  getReaders() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getReader(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createReader(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateReader(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteReader(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchReaders(keyword: string) {
    return this.http.get<any[]>(`${this.apiUrl}/search?keyword=${keyword}`);
  }
}