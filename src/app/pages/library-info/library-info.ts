import { CommonModule } from '@angular/common';
import {ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { AdminService } from '../../services/admin.service';
import { LibrarySettingResponse } from '../../models/library-setting-response';

@Component({
  selector: 'app-library-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './library-info.html',
  styleUrl: './library-info.css'
})
export class LibraryInfoComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  setting: LibrarySettingResponse | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPublicSettings();
  }

  loadPublicSettings(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getPublicSettings().subscribe({
      next: (result) => {
        this.setting = result;
        this.isLoading=false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('LOAD PUBLIC SETTINGS ERROR:', err);
        this.errorMessage = 'Không thể tải thông tin thư viện.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  formatMoney(value: number | undefined): string {
    const amount = value ?? 0;

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }

  formatDate(value: string | undefined): string {
    if (!value) {
      return 'Chưa cập nhật';
    }

    return new Date(value).toLocaleString('vi-VN');
  }
}