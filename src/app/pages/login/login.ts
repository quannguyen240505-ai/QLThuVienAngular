import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  isLoading = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  handleLogin(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const data: LoginRequest = {
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? '',
    };

    this.authService.login(data).subscribe({
      next: (result) => {
        if (!result || !result.token) {
          this.errorMessage = 'Đăng nhập thất bại.';
          this.isLoading = false;
          return;
        }

        this.authService.saveAuthData(result);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log('LOGIN ERROR:', err);

        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.status === 0) {
          this.errorMessage = 'Không kết nối được tới API. Kiểm tra API hoặc CORS.';
        } else if (err.status === 400 || err.status === 401) {
          this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        } else {
          this.errorMessage = `Lỗi đăng nhập: ${err.status}`;
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
