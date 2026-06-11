import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { BorrowService } from '../../services/borrow.service';

@Component({
  selector: 'app-overdue-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overdue-books.html',
  styleUrl: './overdue-books.css'
})
export class OverdueBooksComponent implements OnInit {
  private borrowService = inject(BorrowService);
  private cdr = inject(ChangeDetectorRef);

  overdueBooks: any[] = [];
  isLoading = false;
  message = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.message = '';

    this.borrowService.getOverdueBooks().subscribe({
      next: (data: any[]) => {
        this.overdueBooks = data.sort((a: any, b: any) => {
          const dayA = this.calculateOverdueDays(a.dueDate);
          const dayB = this.calculateOverdueDays(b.dueDate);
          return dayB - dayA;
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.message = 'Không thể tải danh sách sách quá hạn.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateOverdueDays(dueDate: string): number {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.floor((today.getTime() - due.getTime()) / 86400000);
  }

  calculateFine(dueDate: string): number {
    return this.calculateOverdueDays(dueDate) * 5000;
  }
}