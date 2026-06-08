import { CommonModule } from '@angular/common';
import {ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../services/admin.service';
import { UserResponse } from '../../models/user-response';
import { CreateUserRequest } from '../../models/create-user-request';
import { UpdateUserRequest } from '../../models/update-user-request';
import { AdminResetUserPasswordRequest } from '../../models/admin-reset-user-password-request';

import { UserTableComponent } from '../../components/user-table/user-table';
import { UserFormModalComponent } from '../../components/user-form-modal/user-form-modal';
import { ResetPasswordModalComponent } from '../../components/reset-password-modal/reset-password-modal';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UserTableComponent,
    UserFormModalComponent,
    ResetPasswordModalComponent
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css'
})
export class AccountsComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];

  searchText = '';
  roleFilter = 'All';

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  isUserModalOpen = false;
  editingUser: UserResponse | null = null;

  isResetPasswordModalOpen = false;
  selectedUser: UserResponse | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminService.getUsers().subscribe({
      next: (result) => {
        this.users = result;
        this.applyFilter();
        this.isLoading=false;
        
        // Ép Angular cập nhật giao diện ngay
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('LOAD USERS ERROR:', err);

        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Bạn không có quyền truy cập chức năng này.';
        } else {
          this.errorMessage = 'Không thể tải danh sách tài khoản.';
        }

        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const keyword = this.searchText.trim().toLowerCase();

    this.filteredUsers = this.users.filter(user => {
      const matchesKeyword =
        user.username.toLowerCase().includes(keyword) ||
        user.gmail.toLowerCase().includes(keyword);

      const matchesRole =
        this.roleFilter === 'All' ||
        user.role === this.roleFilter;

      return matchesKeyword && matchesRole;
    });
  }

  openCreateModal(): void {
    this.editingUser = null;
    this.isUserModalOpen = true;
  }

  openEditModal(user: UserResponse): void {
    this.editingUser = user;
    this.isUserModalOpen = true;
  }

  closeUserModal(): void {
    this.isUserModalOpen = false;
    this.editingUser = null;
  }

  createUser(data: CreateUserRequest): void {
     this.errorMessage = '';
     this.successMessage = '';

    this.adminService.createUser(data).subscribe({
      next: () => {
        this.successMessage = 'Thêm tài khoản thành công.';
        this.closeUserModal();
        this.loadUsers();
      },
      error: (err) => {
        console.log('CREATE USER ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Thêm tài khoản thất bại.');
      }
    });
  }

  updateUser(payload: { id: number; data: UpdateUserRequest }): void {
    this.errorMessage = '';

    this.adminService.updateUser(payload.id, payload.data).subscribe({
      next: () => {
        this.successMessage = 'Cập nhật tài khoản thành công.';
        this.closeUserModal();
        this.loadUsers();
      },
      error: (err) => {
        console.log('UPDATE USER ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Cập nhật tài khoản thất bại.');
      }
    });
  }

  deleteUser(user: UserResponse): void {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user.username}" không?`);

    if (!confirmed) {
      return;
    }

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.successMessage = 'Xóa tài khoản thành công.';
        this.loadUsers();
      },
      error: (err) => {
        console.log('DELETE USER ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Xóa tài khoản thất bại.');
      }
    });
  }

  changeRole(payload: { user: UserResponse; role: string }): void {
    if (payload.user.role === payload.role) {
      return;
    }

    const confirmed = window.confirm(`Đổi vai trò của "${payload.user.username}" thành ${payload.role}?`);

    if (!confirmed) {
      this.loadUsers();
      return;
    }

    this.adminService.updateUserRole(payload.user.id, payload.role).subscribe({
      next: () => {
        this.successMessage = 'Cập nhật vai trò thành công.';
        this.loadUsers();
      },
      error: (err) => {
        console.log('CHANGE ROLE ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Cập nhật vai trò thất bại.');
        this.loadUsers();
      }
    });
  }

  toggleStatus(user: UserResponse): void {
    const newStatus = !user.isActive;
    const actionText = newStatus ? 'mở khóa' : 'khóa';

    const confirmed = window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản "${user.username}" không?`);

    if (!confirmed) {
      return;
    }

    this.adminService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        this.successMessage = `${newStatus ? 'Mở khóa' : 'Khóa'} tài khoản thành công.`;
        this.loadUsers();
      },
      error: (err) => {
        console.log('TOGGLE STATUS ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Cập nhật trạng thái thất bại.');
      }
    });
  }

  openResetPasswordModal(user: UserResponse): void {
    this.selectedUser = user;
    this.isResetPasswordModalOpen = true;
  }

  closeResetPasswordModal(): void {
    this.selectedUser = null;
    this.isResetPasswordModalOpen = false;
  }

  resetPassword(data: AdminResetUserPasswordRequest): void {
    if (!this.selectedUser) {
      return;
    }

    this.adminService.resetUserPassword(this.selectedUser.id, data).subscribe({
      next: () => {
        this.successMessage = 'Đặt lại mật khẩu thành công.';
        this.closeResetPasswordModal();
      },
      error: (err) => {
        console.log('RESET USER PASSWORD ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Đặt lại mật khẩu thất bại.');
      }
    });
  }

  private getErrorText(err: any, fallback: string): string {
    if (err.error && typeof err.error === 'string') {
      return err.error;
    }

    return fallback;
  }
}