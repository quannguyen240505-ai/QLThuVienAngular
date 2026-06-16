import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteBookService } from '../../services/favorite-book.service';
import { FavoriteBook } from '../../models/favorite-book.model';

@Component({
  selector: 'app-favorite-books',
  imports: [CommonModule],
  templateUrl: './favorite-books.html',
  styleUrl: './favorite-books.css'
})
export class FavoriteBooks implements OnInit {
  private favoriteService = inject(FavoriteBookService);

  favorites: FavoriteBook[] = [];

  ngOnInit(): void {
    this.favoriteService.favorites$.subscribe(data => {
      this.favorites = data;
    });

    this.favoriteService.loadFavorites().subscribe({
      error: err => {
        console.error('Lỗi tải sách yêu thích:', err);
      }
    });
  }

  removeFavorite(bookId: number): void {
    this.favoriteService.removeFavorite(bookId).subscribe({
      error: err => {
        console.error('Lỗi bỏ yêu thích:', err);
      }
    });
  }
}