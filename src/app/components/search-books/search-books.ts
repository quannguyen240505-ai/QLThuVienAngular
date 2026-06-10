import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book';

@Component({
  selector: 'app-search-books',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-books.html',
  styleUrls: ['./search-books.css']
})
export class SearchBooksComponent implements OnInit {
  allBooks: Book[] = [];
  searchResults: Book[] = [];
  loading = true;
  searchKeyword = '';
  selectedCategory = '';
  categories: string[] = [];
  totalResults = 0;

  private bookService = inject(BookService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getAll().subscribe({
      next: (books) => {
        this.allBooks = books;
        this.extractCategories();
        this.searchBooks();
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

  extractCategories(): void {
    const cats = new Set<string>();
    this.allBooks.forEach(book => {
      if (book.category) cats.add(book.category);
    });
    this.categories = Array.from(cats).sort();
  }

  searchBooks(): void {
    let results = this.allBooks;
    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase();
      results = results.filter(book =>
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        (book.category && book.category.toLowerCase().includes(keyword))
      );
    }
    if (this.selectedCategory) {
      results = results.filter(book => book.category === this.selectedCategory);
    }
    this.searchResults = results;
    this.totalResults = this.searchResults.length;
  }

  onSearch(): void {
    this.searchBooks();
  }

  clearFilters(): void {
    this.searchKeyword = '';
    this.selectedCategory = '';
    this.searchBooks();
  }

  getButtonText(book: Book): string {
    if (book.availableCopies === 0) return 'Hết sách';
    if (!this.authService.isLoggedIn()) return 'Đăng nhập';
    return 'Mượn sách';
  }

  borrowBook(bookId: number): void {
    const book = this.allBooks.find(b => b.id === bookId);
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
}