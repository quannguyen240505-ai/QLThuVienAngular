import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReaderService } from '../../services/reader.service';
import { Reader } from '../../models/reader';

@Component({
  selector: 'app-reader-create',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reader-create.html',
  styleUrl: './reader-create.css',
})
export class ReaderCreate {
  reader: Reader = {
    readerId: 0,
    fullName: '',
    phone: '',
    email: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    createdDate: '',
    status: 'Active'
  };

  id = 0;
  isEdit = false;
  message = '';

  constructor(
    private readerService: ReaderService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdit = this.id > 0;

    if (this.isEdit) {
      this.loadReader();
    }
  }

  loadReader(): void {
    this.readerService.getReader(this.id).subscribe({
      next: data => {
        this.reader = {
          readerId: data.readerId,
          fullName: data.fullName ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
          address: data.address ?? '',
          gender: data.gender ?? '',
          status: data.status ?? 'Active',
          createdDate: data.createdDate ?? '',
          dateOfBirth: data.dateOfBirth
            ? data.dateOfBirth.substring(0, 10)
            : ''
        };

        this.cdr.detectChanges();
      },
      error: err => {
        console.log(err);
        this.message = 'Không tải được thông tin độc giả.';
      }
    });
  }

 save(): void {
  if (!this.reader.fullName.trim()) {
    this.message = 'Vui lòng nhập họ tên.';
    return;
  }

  const payload = {
    readerId: this.reader.readerId,
    fullName: this.reader.fullName,
    phone: this.reader.phone || '',
    email: this.reader.email || '',
    address: this.reader.address || '',
    gender: this.reader.gender || '',
    status: this.reader.status || 'Active',
    dateOfBirth: this.reader.dateOfBirth
      ? this.reader.dateOfBirth
      : null,
    createdDate: this.reader.createdDate
      ? this.reader.createdDate
      : new Date().toISOString()
  };

  if (this.isEdit) {
    this.readerService.updateReader(this.id, payload).subscribe({
      next: () => {
        this.router.navigate(['/readers']);
      },
      error: err => {
        console.log(err);
        this.message = err.error?.message ?? err.error ?? 'Cập nhật độc giả thất bại.';
      }
    });
  } else {
    this.readerService.createReader(payload).subscribe({
      next: () => {
        this.router.navigate(['/readers']);
      },
      error: err => {
        console.log(err);
        this.message = err.error?.message ?? err.error ?? 'Thêm độc giả thất bại.';
      }
    });
  }
}
}
