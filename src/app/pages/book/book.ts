import { FavoriteBookService } from '../../services/favorite-book.service';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book.html',
  styleUrls: ['./book.css']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  loading = true;
  searchTerm = '';
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalBooks = 0;

  private bookService = inject(BookService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private favoriteService = inject(FavoriteBookService);

  ngOnInit(): void {
  this.loadBooks();
  this.favoriteService.loadFavorites().subscribe();
}

  loadBooks(): void {
    this.loading = true;
    this.bookService.getAll().subscribe({
      next: (data) => {
        this.books = data.sort((a, b) => a.id - b.id);
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải sách:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    let filtered = this.books;
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = this.books.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        (book.category && book.category.toLowerCase().includes(term))
      );
    }
    this.totalBooks = filtered.length;
    this.totalPages = Math.ceil(this.totalBooks / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.filteredBooks = filtered.slice(start, start + this.pageSize);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilter();
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getButtonText(book: Book): string {
    if (book.availableCopies === 0) return 'Hết sách';
    if (!this.authService.isLoggedIn()) return 'Muợn sách';
    return 'Mượn sách';
  }

  borrowBook(bookId: number): void {
    const book = this.books.find(b => b.id === bookId);
    if (!book) return;
    if (book.availableCopies === 0) {
      alert('Sách đã hết, vui lòng chọn sách khác.');
      return;
    }
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/books', bookId]);
    }
  }
  toggleFavorite(book: Book): void {
  this.favoriteService.toggleFavorite(book);
}

isFavorite(bookId: number): boolean {
  return this.favoriteService.isFavorite(bookId);
}
}