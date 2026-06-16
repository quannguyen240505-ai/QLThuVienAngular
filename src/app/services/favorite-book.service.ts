import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FavoriteBook } from '../models/favorite-book.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteBookService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7067/api/FavoriteBooks';

  private favoritesSubject = new BehaviorSubject<FavoriteBook[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  loadFavorites(): Observable<FavoriteBook[]> {
    return this.http.get<FavoriteBook[]>(this.apiUrl).pipe(
      tap(data => {
        this.favoritesSubject.next(data);
      })
    );
  }

  getFavorites(): FavoriteBook[] {
    return this.favoritesSubject.value;
  }

  isFavorite(bookId: number): boolean {
    return this.getFavorites().some(item => item.bookId === bookId);
  }

  addFavorite(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${bookId}`, {}).pipe(
      tap(() => {
        this.loadFavorites().subscribe();
      })
    );
  }

  removeFavorite(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookId}`).pipe(
      tap(() => {
        this.loadFavorites().subscribe();
      })
    );
  }

  toggleFavorite(book: any): void {
    if (this.isFavorite(book.id)) {
      this.removeFavorite(book.id).subscribe({
        error: err => {
          console.error('Lỗi bỏ yêu thích:', err);
        }
      });
    } else {
      this.addFavorite(book.id).subscribe({
        error: err => {
          console.error('Lỗi thêm yêu thích:', err);
        }
      });
    }
  }
}