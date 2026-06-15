import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { BorrowService } from '../../services/borrow.service';

@Component({
  selector: 'app-return-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './return-books.html',
  styleUrl: './return-books.css'
})
export class ReturnBooks implements OnInit {
  private borrowService = inject(BorrowService);
  private cdr = inject(ChangeDetectorRef);

  borrowings: any[] = [];
  isLoading = false;
  message = '';

  ngOnInit(): void {
    this.loadMyBorrowing();
  }

  loadMyBorrowing(): void {
    this.isLoading = true;
    this.message = '';

    this.borrowService.getMyBorrowing().subscribe({
      next: (data: any[]) => {
        this.borrowings = data.sort((a: any, b: any) =>
          new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
        );

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.message = err.error?.message ?? err.error ?? 'Không thể tải sách đang mượn.';
        this.isLoading = false;
      }
    });
  }

  returnBook(ticket: any): void {
    if (!confirm(`Bạn có chắc muốn trả phiếu #${ticket.borrowTicketId}?`)) {
      return;
    }

    this.borrowService.memberReturn(ticket.borrowTicketId).subscribe({
      next: (result: any) => {
        const overdueDays = result?.overdueDays ?? 0;
        const fineAmount = result?.fineAmount ?? 0;

        this.message =
          `Trả sách thành công. Quá hạn: ${overdueDays} ngày. Phí phạt: ${this.formatMoney(fineAmount)}.`;

        this.loadMyBorrowing();
      },
      error: (err: any) => {
        console.log(err);
        this.message = err.error?.message ?? err.error ?? 'Trả sách thất bại.';
      }
    });
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value ?? 0) + ' VNĐ';
  }
}