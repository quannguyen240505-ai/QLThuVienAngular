import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { BorrowService } from '../../services/borrow.service';

@Component({
  selector: 'app-borrow-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrow-request.html',
  styleUrl: './borrow-request.css'
})
export class BorrowRequestPage implements OnInit {
  private borrowService = inject(BorrowService);
  private cdr = inject(ChangeDetectorRef);

  requests: any[] = [];
  selectedStatus = 'All';

  isLoading = false;
  message = '';

  ngOnInit(): void {
    this.loadRequests();
  }

  get filteredRequests(): any[] {
    if (this.selectedStatus === 'All') {
      return this.requests;
    }

    return this.requests.filter(x => x.status === this.selectedStatus);
  }

  get pendingCount(): number {
    return this.requests.filter(x => x.status === 'Pending').length;
  }

  get borrowingCount(): number {
    return this.requests.filter(x => x.status === 'Borrowing').length;
  }

  get returnedCount(): number {
    return this.requests.filter(x => x.status === 'Returned').length;
  }

  loadRequests(): void {
    this.isLoading = true;
    this.message = '';

    this.borrowService.getMyBorrowHistory().subscribe({
      next: (data: any[]) => {
        this.requests = data.sort((a: any, b: any) =>
          new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
        );

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.message = err.error?.message ?? err.error ?? 'Không thể tải trạng thái yêu cầu mượn.';
        this.isLoading = false;
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
}