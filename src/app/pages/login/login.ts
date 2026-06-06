import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
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
      password: this.loginForm.value.password ?? ''
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
      error: () => {
        this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng.';
        this.isLoading = false;
      }
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}