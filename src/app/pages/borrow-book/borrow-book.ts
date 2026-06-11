import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BookService } from '../../services/book.service';
import { BorrowService } from '../../services/borrow.service';
import { AdminService } from '../../services/admin.service';

import { Book } from '../../models/book';
import { BorrowBookItem, BorrowRequest } from '../../models/borrow';
import { LibrarySettingResponse } from '../../models/library-setting-response';

@Component({
  selector: 'app-borrow-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './borrow-book.html',
  styleUrl: './borrow-book.css',
})
export class BorrowBook implements OnInit {
  private bookService = inject(BookService);
  private borrowService = inject(BorrowService);
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];
  setting: LibrarySettingResponse | null = null;

  borrow: BorrowRequest = {
    dueDate: '',
    note: '',
    books: []
  };

  bookItem: BorrowBookItem = {
    bookId: 0,
    quantity: 1
  };

  message = '';
  isSuccess = false;
  isLoading = false;

  ngOnInit(): void {
    this.loadSettings();
    this.loadBooks();
  }

  loadSettings(): void {
    this.adminService.getPublicSettings().subscribe({
      next: (result: LibrarySettingResponse) => {
        this.setting = result;

        this.borrow.dueDate = this.formatDate(
          this.addDays(new Date(), Math.min(7, this.maxBorrowDays))
        );

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.showError('Không thể tải chính sách mượn sách.');
      }
    });
  }

  loadBooks(): void {
    this.bookService.getAll().subscribe({
      next: (data: Book[]) => {
        this.books = data.filter(x => x.availableCopies > 0);

        const bookId = Number(this.route.snapshot.queryParamMap.get('bookId'));
        if (bookId > 0) {
          this.bookItem.bookId = bookId;
        }

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.showError('Không thể tải danh sách sách.');
      }
    });
  }

  get maxBorrowBooks(): number {
    return this.setting?.maxBorrowBooks ?? 5;
  }

  get maxBorrowDays(): number {
    return this.setting?.maxBorrowDays ?? 14;
  }

  get todayText(): string {
    return this.formatDate(new Date());
  }

  get maxDueDateText(): string {
    return this.formatDate(this.addDays(new Date(), this.maxBorrowDays));
  }

  get totalSelectedQuantity(): number {
    return this.borrow.books.reduce((sum, x) => sum + Number(x.quantity), 0);
  }

  addBook(): void {
    if (!this.setting?.allowBorrowRequest) {
      this.showError('Thư viện hiện đang tạm ngừng nhận yêu cầu mượn sách.');
      return;
    }

    if (this.bookItem.bookId <= 0) {
      this.showError('Vui lòng chọn sách.');
      return;
    }

    if (this.bookItem.quantity <= 0) {
      this.showError('Số lượng phải lớn hơn 0.');
      return;
    }

    const totalAfterAdd = this.totalSelectedQuantity + Number(this.bookItem.quantity);

    if (totalAfterAdd > this.maxBorrowBooks) {
      this.showError(`Mỗi lần chỉ được mượn tối đa ${this.maxBorrowBooks} quyển sách.`);
      return;
    }

    const book = this.books.find(x => x.id === Number(this.bookItem.bookId));

    if (!book) {
      this.showError('Sách không tồn tại.');
      return;
    }

    if (book.availableCopies < this.bookItem.quantity) {
      this.showError(`Sách "${book.title}" không đủ số lượng.`);
      return;
    }

    const existed = this.borrow.books.find(x => x.bookId === Number(this.bookItem.bookId));

    if (existed) {
      const newQuantity = Number(existed.quantity) + Number(this.bookItem.quantity);

      if (newQuantity > book.availableCopies) {
        this.showError(`Sách "${book.title}" không đủ số lượng.`);
        return;
      }

      existed.quantity = newQuantity;
    } else {
      this.borrow.books.push({
        bookId: Number(this.bookItem.bookId),
        quantity: Number(this.bookItem.quantity)
      });
    }

    this.bookItem = {
      bookId: 0,
      quantity: 1
    };

    this.message = '';
  }

  removeBook(item: BorrowBookItem): void {
    this.borrow.books = this.borrow.books.filter(x => x !== item);
  }

  sendBorrowRequest(): void {
    if (!this.setting?.allowBorrowRequest) {
      this.showError('Thư viện hiện đang tạm ngừng nhận yêu cầu mượn sách.');
      return;
    }

    if (this.borrow.books.length === 0) {
      this.showError('Vui lòng thêm ít nhất một sách.');
      return;
    }

    if (this.totalSelectedQuantity > this.maxBorrowBooks) {
      this.showError(`Mỗi lần chỉ được mượn tối đa ${this.maxBorrowBooks} quyển sách.`);
      return;
    }

    const dueDate = new Date(this.borrow.dueDate);
    const maxDueDate = this.addDays(new Date(), this.maxBorrowDays);

    if (dueDate > maxDueDate) {
      this.showError(`Số ngày mượn tối đa là ${this.maxBorrowDays} ngày.`);
      return;
    }

    this.isLoading = true;

    this.borrowService.sendBorrowRequest(this.borrow).subscribe({
      next: () => {
        this.message = 'Gửi yêu cầu mượn sách thành công. Vui lòng chờ thủ thư duyệt.';
        this.isSuccess = true;
        this.isLoading = false;
        this.resetForm();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading = false;
        this.showError(err.error?.message ?? err.error ?? 'Gửi yêu cầu mượn sách thất bại.');
      }
    });
  }

  resetForm(): void {
    this.borrow = {
      dueDate: this.formatDate(this.addDays(new Date(), Math.min(7, this.maxBorrowDays))),
      note: '',
      books: []
    };

    this.bookItem = {
      bookId: 0,
      quantity: 1
    };
  }

  getBookTitle(bookId: number): string {
    return this.books.find(x => x.id === Number(bookId))?.title ?? 'Không rõ';
  }

  getBookAvailableCopies(bookId: number): number {
    return this.books.find(x => x.id === Number(bookId))?.availableCopies ?? 0;
  }

  private showError(text: string): void {
    this.message = text;
    this.isSuccess = false;
    this.cdr.detectChanges();
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private formatDate(date: Date): string {
    return date.toISOString().substring(0, 10);
  }
}