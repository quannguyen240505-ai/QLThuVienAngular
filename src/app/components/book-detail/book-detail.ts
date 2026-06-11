import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book';
import { BookReviewsComponent } from '../book-reviews/book-reviews';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BookReviewsComponent],
  templateUrl: './book-detail.html',
  styleUrls: ['./book-detail.css']
})
export class BookDetailComponent implements OnInit, OnDestroy {
  book: Book | null = null;
  loading = true;
  error = '';
  private routeSub!: Subscription;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // Lắng nghe thay đổi param (id)
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadBook(+id);
      } else {
        this.error = 'Không tìm thấy ID sách';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.error = '';
    this.book = null;
    this.cdr.detectChanges();

    this.bookService.getById(id).subscribe({
      next: (data) => {
        this.book = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải chi tiết sách:', err);
        this.error = 'Không thể tải thông tin sách. Vui lòng thử lại sau.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteBook(): void {
    if (!this.book) return;
    if (confirm(`Bạn có chắc muốn xóa sách "${this.book.title}"?`)) {
      this.bookService.delete(this.book.id).subscribe({
        next: () => {
          alert('Xóa sách thành công');
          this.router.navigate(['/books']);
        },
        error: (err) => {
          console.error('Xóa thất bại', err);
          alert('Xóa sách thất bại. Vui lòng thử lại.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }

 borrowBook(): void {
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login']);
    return;
  }

  if (!this.book) {
    alert('Không tìm thấy thông tin sách.');
    return;
  }

  if (this.book.availableCopies <= 0) {
    alert('Sách này hiện đã hết, không thể mượn.');
    return;
  }

  this.router.navigate(['/borrow-book'], {
    queryParams: {
      bookId: this.book.id
    }
  });
}

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

}