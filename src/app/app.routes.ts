import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { ResetPasswordComponent } from './pages/reset-password/reset-password';
import { SocialLoginSuccessComponent } from './pages/social-login-success/social-login-success';
import { AccountsComponent } from './pages/accounts/accounts';
import { SystemSettingsComponent } from './pages/system-settings/system-settings';
import { LibraryInfoComponent } from './pages/library-info/library-info';
import { ProfileComponent } from './pages/profile/profile';

import { BooksComponent } from './pages/book/book';
import { BookDetailComponent } from './pages/book-detail/book-detail';
import { SearchBooksComponent } from './pages/search-books/search-books';
import { ManageBooksComponent } from './pages/manage-books/manage-books';

import { Readers } from './pages/readers/readers';
import { ReaderCreate } from './pages/reader-create/reader-create';

import { BorrowBook } from './pages/borrow-book/borrow-book';
import { ReturnBooks } from './pages/return-books/return-books';
import { BorrowHistory } from './pages/borrow-history/borrow-history';
import { ManageBorrowsComponent } from './pages/manage-borrows/manage-borrows';
import { BorrowRequestPage } from './pages/borrow-request/borrow-request';
import { OverdueBooksComponent } from './pages/overdue-books/overdue-books';

import { StatisticsComponent } from './pages/statistics/statistics';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Thư viện Đại học - QNU',
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Đăng nhập',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Đăng ký',
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'Quên mật khẩu',
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'Đặt lại mật khẩu',
      },
      {
        path: 'social-login-success',
        component: SocialLoginSuccessComponent,
        title: 'Đang đăng nhập',
      },

      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Tài khoản của tôi',
      },
      {
        path: 'accounts',
        component: AccountsComponent,
        title: 'Quản lý tài khoản',
      },
      {
        path: 'system',
        component: SystemSettingsComponent,
        title: 'Quản lý hệ thống',
      },
      {
        path: 'library-info',
        component: LibraryInfoComponent,
        title: 'Thông tin thư viện',
      },

      {
        path: 'books',
        component: BooksComponent,
        title: 'Danh sách sách',
      },
      {
        path: 'books/:id',
        component: BookDetailComponent,
        title: 'Chi tiết sách',
      },
      {
        path: 'search-books',
        component: SearchBooksComponent,
        title: 'Tìm kiếm sách',
      },
      {
        path: 'manage-books',
        component: ManageBooksComponent,
        title: 'Quản lý sách',
      },

      {
        path: 'readers',
        component: Readers,
        title: 'Quản lý độc giả',
      },
      {
        path: 'readers/create',
        component: ReaderCreate,
        title: 'Thêm độc giả',
      },
      {
        path: 'readers/edit/:id',
        component: ReaderCreate,
        title: 'Cập nhật độc giả',
      },

      {
        path: 'borrow-book',
        component: BorrowBook,
        title: 'Lập phiếu mượn',
      },
      {
        path: 'return-books',
        component: ReturnBooks,
        title: 'Trả sách',
      },
      {
        path: 'borrow-history',
        component: BorrowHistory,
        title: 'Lịch sử mượn/trả',
      },
      {
        path: 'manage-borrows',
        component: ManageBorrowsComponent,
        title: 'Duyệt yêu cầu mượn',
      },
      {
        path: 'borrow-request',
        component: BorrowRequestPage,
        title: 'Trạng thái yêu cầu mượn',
      },
      {
        path: 'overdue-books',
        component: OverdueBooksComponent,
        title: 'Sách quá hạn',
      },

      {
        path: 'statistics',
        component: StatisticsComponent,
        title: 'Thống kê hoạt động',
      },
    ],
  },
];