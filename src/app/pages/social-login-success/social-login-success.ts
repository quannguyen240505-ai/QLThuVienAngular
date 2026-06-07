import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ExchangeSocialCodeRequest } from '../../models/exchange-social-code-request';

@Component({
  selector: 'app-social-login-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-login-success.html',
  styleUrl: './social-login-success.css'
})
export class SocialLoginSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  errorMessage = '';

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');
    const code = this.route.snapshot.queryParamMap.get('code');

    if (error) {
      this.errorMessage = this.getErrorMessage(error);
      return;
    }

    if (!code) {
      this.errorMessage = 'Không nhận được mã đăng nhập từ máy chủ.';
      return;
    }

    const data: ExchangeSocialCodeRequest = {
      code: code
    };

    this.authService.exchangeSocialCode(data).subscribe({
      next: (result) => {
        if (!result || !result.token) {
          this.errorMessage = 'Không nhận được token đăng nhập.';
          return;
        }

        this.authService.saveAuthData(result);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log('SOCIAL LOGIN ERROR:', err);

        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.status === 0) {
          this.errorMessage = 'Không thể kết nối đến máy chủ API.';
        } else {
          this.errorMessage = 'Không thể hoàn tất đăng nhập Google.';
        }
      }
    });
  }

  private getErrorMessage(error: string): string {
    switch (error) {
      case 'google_auth_failed':
        return 'Đăng nhập Google thất bại.';
      case 'email_not_found':
        return 'Không lấy được Gmail từ tài khoản Google.';
      case 'account_locked':
        return 'Tài khoản của bạn đã bị khóa.';
      default:
        return 'Đăng nhập Google thất bại.';
    }
  }
}