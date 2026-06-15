import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ForgotPasswordRequest } from '../../models/forgot-password-request';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  forgotForm = this.fb.group({
    gmail: ['', [Validators.required, Validators.email]],
  });

  handleForgotPassword(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const data: ForgotPasswordRequest = {
      gmail: this.forgotForm.value.gmail ?? '',
    };

    this.authService.forgotPassword(data).subscribe({
      next: () => {
        this.successMessage = 'Mã PIN đã được gửi về Gmail của bạn.';

        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: {
              gmail: data.gmail,
            },
          });
        }, 900);
      },
      error: (err) => {
        console.log('FORGOT PASSWORD ERROR:', err);

        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.status === 0) {
          this.errorMessage = 'Không thể kết nối đến máy chủ API.';
        } else {
          this.errorMessage = 'Gửi mã PIN thất bại. Vui lòng kiểm tra lại Gmail.';
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
