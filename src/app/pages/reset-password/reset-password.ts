import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ResetPasswordRequest } from '../../models/reset-password-request';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  resetForm = this.fb.group(
    {
      gmail: ['', [Validators.required, Validators.email]],
      pin: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    },
    {
      validators: this.passwordMatchValidator
    }
  );

  ngOnInit(): void {
    const gmail = this.route.snapshot.queryParamMap.get('gmail');

    if (gmail) {
      this.resetForm.patchValue({
        gmail: gmail
      });
    }
  }

  handleResetPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const data: ResetPasswordRequest = {
      gmail: this.resetForm.value.gmail ?? '',
      pin: this.resetForm.value.pin ?? '',
      newPassword: this.resetForm.value.newPassword ?? '',
      confirmNewPassword: this.resetForm.value.confirmNewPassword ?? ''
    };

    this.authService.resetPassword(data).subscribe({
      next: () => {
        this.successMessage = 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        console.log('RESET PASSWORD ERROR:', err);

        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.status === 0) {
          this.errorMessage = 'Không thể kết nối đến máy chủ API.';
        } else {
          this.errorMessage = 'Đặt lại mật khẩu thất bại.';
        }

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmNewPassword = control.get('confirmNewPassword')?.value;

    if (!newPassword || !confirmNewPassword) {
      return null;
    }

    return newPassword === confirmNewPassword ? null : { passwordMismatch: true };
  }
}