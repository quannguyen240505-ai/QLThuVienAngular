import { CommonModule } from '@angular/common';
import { ChangeDetectorRef,Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AdminService } from '../../services/admin.service';
import { LibrarySettingResponse } from '../../models/library-setting-response';
import { UpdateLibrarySettingRequest } from '../../models/update-library-setting-request';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './system-settings.html',
  styleUrl: './system-settings.css'
})
export class SystemSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  currentSetting: LibrarySettingResponse | null = null;

  settingForm = this.fb.group({
    libraryName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    openingHours: [''],
    maxBorrowBooks: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
    maxBorrowDays: [14, [Validators.required, Validators.min(1), Validators.max(365)]],
    overdueFinePerDay: [5000, [Validators.required, Validators.min(0), Validators.max(1000000)]],
    allowBorrowRequest: [true],
    libraryRules: ['']
  });

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.getSettings().subscribe({
      next: (result) => {
        this.currentSetting = result;
        this.isLoading=false;
        this.cdr.detectChanges();

        this.settingForm.patchValue({
          libraryName: result.libraryName,
          email: result.email,
          phone: result.phone,
          address: result.address,
          openingHours: result.openingHours,
          maxBorrowBooks: result.maxBorrowBooks,
          maxBorrowDays: result.maxBorrowDays,
          overdueFinePerDay: result.overdueFinePerDay,
          allowBorrowRequest: result.allowBorrowRequest,
          libraryRules: result.libraryRules
        });
      },
      error: (err) => {
        console.log('LOAD SETTINGS ERROR:', err);

        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Bạn không có quyền truy cập chức năng này.';
        } else {
          this.errorMessage = 'Không thể tải cấu hình hệ thống.';
        }

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  saveSettings(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.settingForm.invalid) {
      this.settingForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const data: UpdateLibrarySettingRequest = {
      libraryName: this.settingForm.value.libraryName ?? '',
      email: this.settingForm.value.email ?? '',
      phone: this.settingForm.value.phone ?? '',
      address: this.settingForm.value.address ?? '',
      openingHours: this.settingForm.value.openingHours ?? '',
      maxBorrowBooks: Number(this.settingForm.value.maxBorrowBooks ?? 1),
      maxBorrowDays: Number(this.settingForm.value.maxBorrowDays ?? 1),
      overdueFinePerDay: Number(this.settingForm.value.overdueFinePerDay ?? 0),
      allowBorrowRequest: this.settingForm.value.allowBorrowRequest ?? false,
      libraryRules: this.settingForm.value.libraryRules ?? ''
    };

    this.adminService.updateSettings(data).subscribe({
      next: () => {
        this.successMessage = 'Cập nhật cấu hình hệ thống thành công.';
        this.loadSettings();
      },
      error: (err) => {
        console.log('UPDATE SETTINGS ERROR:', err);

        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Bạn không có quyền cập nhật cấu hình hệ thống.';
        } else {
          this.errorMessage = 'Cập nhật cấu hình hệ thống thất bại.';
        }

        this.isSaving = false;
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  resetForm(): void {
    if (!this.currentSetting) {
      this.loadSettings();
      return;
    }

    this.settingForm.patchValue({
      libraryName: this.currentSetting.libraryName,
      email: this.currentSetting.email,
      phone: this.currentSetting.phone,
      address: this.currentSetting.address,
      openingHours: this.currentSetting.openingHours,
      maxBorrowBooks: this.currentSetting.maxBorrowBooks,
      maxBorrowDays: this.currentSetting.maxBorrowDays,
      overdueFinePerDay: this.currentSetting.overdueFinePerDay,
      allowBorrowRequest: this.currentSetting.allowBorrowRequest,
      libraryRules: this.currentSetting.libraryRules
    });

    this.errorMessage = '';
    this.successMessage = '';
  }

  formatDate(value: string | undefined): string {
    if (!value) {
      return 'Chưa cập nhật';
    }

    return new Date(value).toLocaleString('vi-VN');
  }
}