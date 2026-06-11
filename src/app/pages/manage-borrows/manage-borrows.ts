import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { BorrowService } from '../../services/borrow.service';

@Component({
  selector: 'app-manage-borrows',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-borrows.html',
  styleUrl: './manage-borrows.css'
})
export class ManageBorrowsComponent implements OnInit {
  private borrowService = inject(BorrowService);
  private cdr = inject(ChangeDetectorRef);

  borrowTickets: any[] = [];
  selectedStatus = 'All';

  isLoading = false;
  message = '';

  ngOnInit(): void {
    this.loadBorrows();
  }

  get filteredBorrows(): any[] {
    if (this.selectedStatus === 'All') {
      return this.borrowTickets;
    }

    return this.borrowTickets.filter(x => x.status === this.selectedStatus);
  }

  get pendingCount(): number {
    return this.borrowTickets.filter(x => x.status === 'Pending').length;
  }

  get borrowingCount(): number {
    return this.borrowTickets.filter(x => x.status === 'Borrowing').length;
  }

  get returnedCount(): number {
    return this.borrowTickets.filter(x => x.status === 'Returned').length;
  }

loadBorrows(): void {
  this.isLoading = true;
  this.message = '';

  this.borrowService.getBorrowHistory().subscribe({
    next: (data: any[]) => {
      this.borrowTickets = data.sort((a: any, b: any) => {
        return new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime();
      });

      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.log(err);
      this.message = 'Không thể tải danh sách phiếu mượn.';
      this.isLoading = false;
    }
  });
}

  approveBorrow(ticket: any): void {
    if (!confirm(`Duyệt yêu cầu mượn của ${ticket.readerName}?`)) {
      return;
    }

    this.borrowService.approveBorrow(ticket.borrowTicketId).subscribe({
      next: () => {
        this.message = 'Duyệt phiếu mượn thành công.';
        this.loadBorrows();
      },
      error: (err: any) => {
        console.log(err);
        this.message = err.error?.message ?? err.error ?? 'Duyệt phiếu thất bại.';
      }
    });
  }

  returnBook(ticket: any): void {
    if (!confirm(`Xác nhận trả sách cho ${ticket.readerName}?`)) {
      return;
    }

    this.borrowService.returnBook(ticket.borrowTicketId).subscribe({
      next: (result: any) => {
        const overdueDays = result?.overdueDays ?? 0;
        const fineAmount = result?.fineAmount ?? 0;

        this.message =
          `Trả sách thành công. Quá hạn: ${overdueDays} ngày. Phí phạt: ${this.formatMoney(fineAmount)}.`;

        this.loadBorrows();
      },
      error: (err: any) => {
        console.log(err);
        this.message = err.error?.message ?? err.error ?? 'Trả sách thất bại.';
      }
    });
  }

  setStatus(status: string): void {
    this.selectedStatus = status;
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
    return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
  }
}