import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookReview } from '../models/book-review';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BookReviewService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private apiUrl = 'https://localhost:7067/api/BookReviews';

    private getHeaders(): HttpHeaders {
        const token = this.auth.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    // Lấy danh sách đánh giá của một cuốn sách (chỉ các review đã được duyệt)
    getReviewsByBook(bookId: number): Observable<BookReview[]> {
        return this.http.get<BookReview[]>(`${this.apiUrl}/book/${bookId}`);
    }

    // Thêm đánh giá mới (yêu cầu đăng nhập)
    addReview(review: Partial<BookReview>): Observable<BookReview> {
        return this.http.post<BookReview>(this.apiUrl, review, { headers: this.getHeaders() });
    }

    // Admin: lấy tất cả đánh giá (kể cả chưa duyệt)
    getAllReviewsForAdmin(): Observable<BookReview[]> {
        return this.http.get<BookReview[]>(`${this.apiUrl}/admin/all`, { headers: this.getHeaders() });
    }

    // Admin: duyệt / từ chối đánh giá (toggle approve)
    toggleApprove(id: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/toggle-approve`, {}, { headers: this.getHeaders() });
    }

    // Admin: xóa đánh giá
    deleteReview(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}