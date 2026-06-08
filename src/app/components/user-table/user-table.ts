import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserResponse } from '../../models/user-response';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.css'
})
export class UserTableComponent {
  @Input() users: UserResponse[] = [];

  @Output() editUser = new EventEmitter<UserResponse>();
  @Output() deleteUser = new EventEmitter<UserResponse>();
  @Output() resetPassword = new EventEmitter<UserResponse>();
  @Output() toggleStatus = new EventEmitter<UserResponse>();
  @Output() changeRole = new EventEmitter<{ user: UserResponse; role: string }>();

  getAvatarText(username: string): string {
    if (!username) {
      return 'U';
    }

    return username.substring(0, 1).toUpperCase();
  }

  getProviderClass(provider: string): string {
    const value = provider?.toLowerCase();

    if (value === 'google') {
      return 'google';
    }

    if (value === 'local') {
      return 'local';
    }

    return 'other';
  }

  onRoleChange(user: UserResponse, event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.changeRole.emit({
      user,
      role: select.value
    });
  }
}