import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-books.html',
  styleUrls: ['./manage-books.css']
})
export class ManageBooksComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  loading = true;
  searchTerm = '';
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;
  totalBooks = 0;

  // Modal
  showModal = false;
  isEditMode = false;
  currentBook: Book = this.getEmptyBook();
  modalTitle = '';

  private bookService = inject(BookService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.checkPermission();
    this.loadBooks();
  }

  checkPermission(): void {
    const role = this.authService.getRole();
    if (role !== 'Librarian' && role !== 'Admin') {
      alert('Bạn không có quyền truy cập trang này!');
      this.router.navigate(['/']);
    }
  }

  getEmptyBook(): Book {
    return {
      id: 0,
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publishYear: new Date().getFullYear(),
      category: '',
      description: '',
      totalCopies: 1,
      availableCopies: 1,
      isActive: true,
      createdAt: new Date(),
      coverImageUrl: ''
    };
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getAll().subscribe({
      next: (data) => {
        // Sắp xếp theo ID tăng dần
        this.books = data.sort((a, b) => a.id - b.id);
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Lỗi tải sách:', err);
        alert('Không thể tải danh sách sách.');
        this.loading = false;
      }
    });
  }

  reloadBooks(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadBooks();
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

  openAddModal(): void {
    this.isEditMode = false;
    this.currentBook = this.getEmptyBook();
    this.modalTitle = 'Thêm sách mới';
    this.showModal = true;
  }

  openEditModal(book: Book): void {
    this.isEditMode = true;
    this.currentBook = { ...book };
    this.modalTitle = 'Sửa thông tin sách';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveBook(): void {
    if (!this.currentBook.title || !this.currentBook.author) {
      alert('Vui lòng nhập tên sách và tác giả.');
      return;
    }
    if (this.currentBook.totalCopies < 0 || this.currentBook.availableCopies < 0) {
      alert('Số lượng sách không hợp lệ.');
      return;
    }
    if (this.currentBook.availableCopies > this.currentBook.totalCopies) {
      alert('Số lượng còn lại không thể lớn hơn tổng số.');
      return;
    }

    if (this.isEditMode) {
      this.bookService.update(this.currentBook.id, this.currentBook).subscribe({
        next: () => {
          alert('Cập nhật sách thành công!');
          this.closeModal();
          this.reloadBooks();
        },
        error: (err) => {
          console.error('Lỗi cập nhật:', err);
          alert('Cập nhật thất bại. Vui lòng thử lại.');
        }
      });
    } else {
      this.bookService.create(this.currentBook).subscribe({
        next: () => {
          alert('Thêm sách thành công!');
          this.closeModal();
          this.reloadBooks();
        },
        error: (err) => {
          console.error('Lỗi thêm sách:', err);
          alert('Thêm sách thất bại. Vui lòng thử lại.');
        }
      });
    }
  }

  deleteBook(id: number, title: string): void {
    if (confirm(`Bạn có chắc chắn muốn xóa sách "${title}"?`)) {
      this.bookService.delete(id).subscribe({
        next: () => {
          alert('Xóa sách thành công!');
          this.reloadBooks();
        },
        error: (err) => {
          console.error('Lỗi xóa sách:', err);
          alert('Xóa sách thất bại. Vui lòng thử lại.');
        }
      });
    }
  }
}