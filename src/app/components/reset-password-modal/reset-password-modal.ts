import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserResponse } from '../../models/user-response';
import { AdminResetUserPasswordRequest } from '../../models/admin-reset-user-password-request';

@Component({
  selector: 'app-reset-password-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password-modal.html',
  styleUrl: './reset-password-modal.css'
})
export class ResetPasswordModalComponent {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() selectedUser: UserResponse | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() savePassword = new EventEmitter<AdminResetUserPasswordRequest>();

  passwordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const data: AdminResetUserPasswordRequest = {
      newPassword: this.passwordForm.value.newPassword ?? ''
    };

    this.savePassword.emit(data);
    this.passwordForm.reset();
  }

  close(): void {
    this.passwordForm.reset();
    this.closeModal.emit();
  }
}