import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserResponse } from '../../models/user-response';
import { CreateUserRequest } from '../../models/create-user-request';
import { UpdateUserRequest } from '../../models/update-user-request';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form-modal.html',
  styleUrl: './user-form-modal.css'
})
export class UserFormModalComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() editingUser: UserResponse | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveCreate = new EventEmitter<CreateUserRequest>();
  @Output() saveUpdate = new EventEmitter<{ id: number; data: UpdateUserRequest }>();

  userForm = this.fb.group({
    username: ['', Validators.required],
    gmail: ['', [Validators.required, Validators.email]],
    dateOfBirth: ['', Validators.required],
    password: ['', [Validators.minLength(6)]],
    role: ['Member', Validators.required],
    isActive: [true]
  });

  get isEditMode(): boolean {
    return this.editingUser !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingUser'] || changes['isOpen']) {
      this.loadFormData();
    }
  }

  submit(): void {
    this.clearPasswordValidatorByMode();

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.editingUser) {
      const data: UpdateUserRequest = {
        username: this.userForm.value.username ?? '',
        gmail: this.userForm.value.gmail ?? '',
        dateOfBirth: this.userForm.value.dateOfBirth ?? '',
        role: this.userForm.value.role ?? 'Member',
        isActive: this.userForm.value.isActive ?? true
      };

      this.saveUpdate.emit({
        id: this.editingUser.id,
        data
      });

      return;
    }

    const data: CreateUserRequest = {
      username: this.userForm.value.username ?? '',
      gmail: this.userForm.value.gmail ?? '',
      dateOfBirth: this.userForm.value.dateOfBirth ?? '',
      password: this.userForm.value.password ?? '',
      role: this.userForm.value.role ?? 'Member',
      isActive: this.userForm.value.isActive ?? true
    };

    this.saveCreate.emit(data);
  }

  close(): void {
    this.closeModal.emit();
  }

  private loadFormData(): void {
    if (!this.isOpen) {
      return;
    }

    if (this.editingUser) {
      this.userForm.patchValue({
        username: this.editingUser.username,
        gmail: this.editingUser.gmail,
        dateOfBirth: this.formatDateForInput(this.editingUser.dateOfBirth),
        password: '',
        role: this.editingUser.role,
        isActive: this.editingUser.isActive
      });

      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      this.userForm.reset({
        username: '',
        gmail: '',
        dateOfBirth: this.getToday(),
        password: '',
        role: 'Member',
        isActive: true
      });

      this.userForm.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  private clearPasswordValidatorByMode(): void {
    const passwordControl = this.userForm.get('password');

    if (!passwordControl) {
      return;
    }

    if (this.isEditMode) {
      passwordControl.clearValidators();
    } else {
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(6)
      ]);
    }

    passwordControl.updateValueAndValidity();
  }

  private formatDateForInput(value: string): string {
    if (!value) {
      return this.getToday();
    }

    return new Date(value).toISOString().substring(0, 10);
  }

  private getToday(): string {
    return new Date().toISOString().substring(0, 10);
  }
}