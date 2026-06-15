import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = false;
  isSavingProfile = false;
  isChangingPassword = false;

  successMessage = '';
  errorMessage = '';

  username = '';
  authProvider = 'Local';
  role = '';
  isActive = true;
  createdAt = '';

  profileForm = this.fb.group({
    gmail: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', Validators.required],
  });

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.accountService.getMyProfile().subscribe({
      next: (res) => {
        this.username = res.username;
        this.role = res.role;
        this.isActive = res.isActive;
        this.authProvider = res.authProvider || 'Local';
        this.createdAt = res.createdAt;

        this.profileForm.patchValue({
          gmail: res.gmail,
          dateOfBirth: this.formatDateForInput(res.dateOfBirth),
        });
        if (this.isGoogleAccount) {
          this.profileForm.get('gmail')?.disable();
        } else {
          this.profileForm.get('gmail')?.enable();
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('LOAD PROFILE ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Không thể tải thông tin tài khoản.');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSavingProfile = true;
    this.successMessage = '';
    this.errorMessage = '';

    const rawValue = this.profileForm.getRawValue();

    const data = {
      gmail: rawValue.gmail ?? '',
      dateOfBirth: rawValue.dateOfBirth ?? '',
    };

    this.accountService.updateProfile(data).subscribe({
      next: (res) => {
        this.authService.saveAuthData(res);

        this.isSavingProfile = false;
        this.successMessage = 'Cập nhật thông tin cá nhân thành công.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('UPDATE PROFILE ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Cập nhật thông tin cá nhân thất bại.');
        this.isSavingProfile = false;
        this.cdr.detectChanges();
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const newPassword = this.passwordForm.value.newPassword ?? '';
    const confirmNewPassword = this.passwordForm.value.confirmNewPassword ?? '';

    if (newPassword !== confirmNewPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp.';
      return;
    }

    this.isChangingPassword = true;
    this.successMessage = '';
    this.errorMessage = '';

    const data = {
      currentPassword: this.passwordForm.value.currentPassword ?? '',
      newPassword,
      confirmNewPassword,
    };

    this.accountService.changePassword(data).subscribe({
      next: (message) => {
        this.successMessage = message || 'Đổi mật khẩu thành công.';
        this.passwordForm.reset();
        this.isChangingPassword = false;
      },
      error: (err) => {
        console.log('CHANGE PASSWORD ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Đổi mật khẩu thất bại.');
        this.isChangingPassword = false;
      },
    });
  }

  getAvatarText(): string {
    if (!this.username.trim()) {
      return 'U';
    }

    return this.username.substring(0, 1).toUpperCase();
  }

  get isGoogleAccount(): boolean {
    return this.authProvider.toLowerCase() === 'google';
  }

  private formatDateForInput(value: string): string {
    if (!value) {
      return '';
    }

    return value.substring(0, 10);
  }

  private getErrorText(err: any, fallback: string): string {
    if (typeof err?.error === 'string' && err.error.trim() !== '') {
      return err.error;
    }

    if (typeof err?.error?.message === 'string') {
      return err.error.message;
    }

    if (typeof err?.error?.title === 'string') {
      return err.error.title;
    }

    if (err?.error?.errors) {
      const firstError = Object.values(err.error.errors).flat()[0];

      if (typeof firstError === 'string') {
        return firstError;
      }
    }

    return fallback;
  }
}
