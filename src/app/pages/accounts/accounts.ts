import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
    ResetPasswordModalComponent,
  ],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class AccountsComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);
  private readonly minLoadingMs = 500;
  private loadingStartedAt = 0;

  users: UserResponse[] = [];
  filteredUsers: UserResponse[] = [];

  searchText = '';
  roleFilter = 'All';
  currentPage = 1;
  pageSize = 5;

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  isUserModalOpen = false;
  editingUser: UserResponse | null = null;
  userModalErrorMessage = '';
  isSavingUser = false;

  isResetPasswordModalOpen = false;
  selectedUser: UserResponse | null = null;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(keepMessage: boolean = false): void {
    this.isLoading = true;
    this.loadingStartedAt = Date.now();

    if (!keepMessage) {
      this.errorMessage = '';
      this.successMessage = '';
    }

    // Cho Angular render dòng "Đang tải..." trước
    this.cdr.detectChanges();

    this.adminService.getUsers().subscribe({
      next: (result) => {
        const elapsed = Date.now() - this.loadingStartedAt;
        const remaining = Math.max(this.minLoadingMs - elapsed, 0);

        setTimeout(() => {
          this.users = result;
          this.applyFilter();

          if (this.currentPage > this.totalPages && this.totalPages > 0) {
            this.currentPage = this.totalPages;
          }

          this.isLoading = false;
          this.cdr.detectChanges();
        }, remaining);
      },
      error: (err) => {
        const elapsed = Date.now() - this.loadingStartedAt;
        const remaining = Math.max(this.minLoadingMs - elapsed, 0);

        setTimeout(() => {
          console.log('LOAD USERS ERROR:', err);

          this.isLoading = false;

          if (!keepMessage) {
            if (err.status === 401 || err.status === 403) {
              this.errorMessage = 'Bạn không có quyền truy cập chức năng này.';
            } else {
              this.errorMessage = 'Không thể tải danh sách tài khoản.';
            }
          }

          this.cdr.detectChanges();
        }, remaining);
      },
    });
  }

  onFilterChanged(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    const keyword = this.searchText.trim().toLowerCase();

    this.filteredUsers = this.users.filter((user) => {
      const username = user.username?.toLowerCase() ?? '';
      const gmail = user.gmail?.toLowerCase() ?? '';

      const matchesKeyword = username.includes(keyword) || gmail.includes(keyword);

      const matchesRole = this.roleFilter === 'All' || user.role === this.roleFilter;

      return matchesKeyword && matchesRole;
    });

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    if (this.totalPages === 0) {
      this.currentPage = 1;
    }

    this.cdr.detectChanges();
  }

  openCreateModal(): void {
    this.editingUser = null;
    this.userModalErrorMessage = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isUserModalOpen = true;
  }

  openEditModal(user: UserResponse): void {
    this.editingUser = { ...user };
    this.userModalErrorMessage = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isUserModalOpen = true;
  }

  closeUserModal(): void {
    this.isUserModalOpen = false;
    this.editingUser = null;
    this.userModalErrorMessage = '';
    this.isSavingUser = false;
  }

  createUser(data: CreateUserRequest): void {
    this.userModalErrorMessage = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isSavingUser = true;

    this.adminService.createUser(data).subscribe({
      next: () => {
        this.isSavingUser = false;
        this.closeUserModal();

        this.successMessage = 'Thêm tài khoản thành công.';
        this.loadUsers(true);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('CREATE USER ERROR:', err);

        this.isSavingUser = false;
        this.userModalErrorMessage = this.getErrorText(err, 'Thêm tài khoản thất bại.');

        this.cdr.detectChanges();
      },
    });
  }

  updateUser(payload: { id: number; data: UpdateUserRequest }): void {
    this.userModalErrorMessage = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isSavingUser = true;

    this.adminService.updateUser(payload.id, payload.data).subscribe({
      next: () => {
        this.isSavingUser = false;
        this.closeUserModal();

        this.successMessage = 'Cập nhật tài khoản thành công.';
        this.loadUsers(true);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('UPDATE USER ERROR:', err);

        this.isSavingUser = false;
        this.userModalErrorMessage = this.getErrorText(err, 'Cập nhật tài khoản thất bại.');

        this.cdr.detectChanges();
      },
    });
  }

  deleteUser(user: UserResponse): void {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${user.username}" không?`,
    );

    if (!confirmed) {
      return;
    }

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = 'Xóa tài khoản thành công.';
        this.loadUsers(true);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('DELETE USER ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Xóa tài khoản thất bại.');
      },
    });
  }

  changeRole(payload: { user: UserResponse; role: string }): void {
    if (payload.user.role === payload.role) {
      return;
    }

    const confirmed = window.confirm(
      `Đổi vai trò của "${payload.user.username}" thành ${payload.role}?`,
    );

    if (!confirmed) {
      this.loadUsers(true);
      return;
    }

    this.adminService.updateUserRole(payload.user.id, payload.role).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = 'Cập nhật vai trò thành công.';
        this.loadUsers(true);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('CHANGE ROLE ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Cập nhật vai trò thất bại.');
        this.loadUsers(true);
      },
    });
  }

  toggleStatus(user: UserResponse): void {
    const newStatus = !user.isActive;
    const actionText = newStatus ? 'mở khóa' : 'khóa';

    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn ${actionText} tài khoản "${user.username}" không?`,
    );

    if (!confirmed) {
      return;
    }

    this.adminService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = `${newStatus ? 'Mở khóa' : 'Khóa'} tài khoản thành công.`;
        this.loadUsers(true);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('TOGGLE STATUS ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Cập nhật trạng thái thất bại.');
      },
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
        this.errorMessage = '';
        this.successMessage = 'Đặt lại mật khẩu thành công.';
        this.closeResetPasswordModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('RESET USER PASSWORD ERROR:', err);
        this.errorMessage = this.getErrorText(err, 'Đặt lại mật khẩu thất bại.');
      },
    });
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

  private refreshUi(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }
  get pagedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;

    return this.filteredUsers.slice(start, start + this.pageSize);
  }
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
