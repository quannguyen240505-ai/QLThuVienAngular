import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookReviewService } from '../../services/book-review.service';
import { AuthService } from '../../services/auth.service';
import { BookReview } from '../../models/book-review';

@Component({
  selector: 'app-book-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-reviews.html',
  styleUrls: ['./book-reviews.css']
})
export class BookReviewsComponent implements OnInit {
  @Input() bookId!: number;
  reviews: BookReview[] = [];
  newRating = 0;
  newComment = '';
  isSubmitting = false;
  isLoading = true;

  private reviewService = inject(BookReviewService);
  public authService = inject(AuthService);

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.reviewService.getReviewsByBook(this.bookId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi tải đánh giá:', err);
        this.isLoading = false;
      }
    });
  }

  setRating(star: number): void {
    if (!this.authService.isLoggedIn()) {
      alert('Vui lòng đăng nhập để đánh giá sách.');
      return;
    }
    this.newRating = star;
  }

  submitReview(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Vui lòng đăng nhập để gửi đánh giá.');
      return;
    }
    if (this.newRating === 0) {
      alert('Vui lòng chọn số sao đánh giá.');
      return;
    }
    if (!this.newComment.trim()) {
      alert('Vui lòng nhập nội dung bình luận.');
      return;
    }

    this.isSubmitting = true;
    this.reviewService.addReview({
      bookId: this.bookId,
      rating: this.newRating,
      comment: this.newComment
    }).subscribe({
      next: (newReview) => {
        alert('Cảm ơn bạn đã đánh giá! Đánh giá sẽ được hiển thị sau khi được duyệt.');
        this.newRating = 0;
        this.newComment = '';
        this.isSubmitting = false;
        this.loadReviews(); // Tải lại danh sách (chỉ hiện approved)
      },
      error: (err) => {
        console.error('Lỗi gửi đánh giá:', err);
        alert('Gửi đánh giá thất bại. Vui lòng thử lại.');
        this.isSubmitting = false;
      }
    });
  }

  // Tính điểm trung bình
  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / this.reviews.length;
  }
}