import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { BorrowService } from '../../services/borrow.service';

@Component({
  selector: 'app-borrow-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrow-history.html',
  styleUrl: './borrow-history.css'
})
export class BorrowHistory implements OnInit {
  private borrowService = inject(BorrowService);
  private cdr = inject(ChangeDetectorRef);

  histories: any[] = [];
  isLoading = false;
  message = '';

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading = true;
    this.message = '';

    this.borrowService.getBorrowHistory().subscribe({
      next: (data: any[]) => {
        this.histories = data.sort((a: any, b: any) => {
          return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.message = 'Không thể tải lịch sử mượn/trả.';
        this.isLoading = false;
      }
    });
  }

  getStatusText(status: string): string {
    if (status === 'Pending') return 'Chờ duyệt';
    if (status === 'Borrowing') return 'Đang mượn';
    if (status === 'Returned') return 'Đã trả';
    return status;
  }

  getStatusClass(status: string): string {
    if (status === 'Pending') return 'status-pending';
    if (status === 'Borrowing') return 'status-borrowing';
    if (status === 'Returned') return 'status-returned';
    return 'status-other';
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value ?? 0) + ' VNĐ';
  }
}