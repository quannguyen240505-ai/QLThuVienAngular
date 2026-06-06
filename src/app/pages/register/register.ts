import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';
  isLoading = false;

  registerForm = this.fb.group(
    {
      username: ['', Validators.required],
      gmail: ['', [Validators.required, Validators.email]],
      dateOfBirth: [this.getToday(), Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: this.passwordMatchValidator
    }
  );

  handleRegister(): void {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const data: RegisterRequest = {
      username: this.registerForm.value.username ?? '',
      gmail: this.registerForm.value.gmail ?? '',
      dateOfBirth: this.registerForm.value.dateOfBirth ?? this.getToday(),
      password: this.registerForm.value.password ?? '',
      confirmPassword: this.registerForm.value.confirmPassword ?? ''
    };

    this.authService.register(data).subscribe({
      next: (result) => {
        if (!result || !result.token) {
          this.errorMessage = 'Đăng ký thất bại.';
          this.isLoading = false;
          return;
        }

        this.authService.saveAuthData(result);
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Đăng ký thất bại. Username hoặc Gmail có thể đã tồn tại.';
        this.isLoading = false;
      }
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private getToday(): string {
    return new Date().toISOString().substring(0, 10);
  }
}