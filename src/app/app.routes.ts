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
import { Readers } from './pages/readers/readers';
import { ReaderCreate } from './pages/reader-create/reader-create';
import { BorrowBook } from './pages/borrow-book/borrow-book';
import { ReturnBooks } from './pages/return-books/return-books';
import { BorrowHistory } from './pages/borrow-history/borrow-history';
import { ManageBorrows } from './pages/manage-borrows/manage-borrows';
import { OverdueBooks } from './pages/overdue-books/overdue-books';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Thư viện Đại học - QNU'
      },
      {
        path: 'login',
        component: LoginComponent,
        title: 'Đăng nhập'
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Đăng ký'
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'Quên mật khẩu'
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'Đặt lại mật khẩu'
      },
      {
        path: 'social-login-success',
        component: SocialLoginSuccessComponent,
        title: 'Đang đăng nhập'
      },
      {
        path: 'accounts',
        component: AccountsComponent,
        title: 'Quản lý tài khoản'
      },
      {
        path: 'system',
        component: SystemSettingsComponent,
        title: 'Quản lý hệ thống'
      },
      {
        path: 'library-info',
        component: LibraryInfoComponent,
        title: 'Thông tin thư viện'
      },
            {
        path: 'readers',
        component: Readers,
        title: 'Quản lý độc giả'
      },
      {
      path: 'readers/create',
      component: ReaderCreate,
      title: 'Thêm độc giả'
    },
    {
      path: 'readers/edit/:id',
      component: ReaderCreate,
      title: 'Cập nhật độc giả'
    },
    {
      path: 'borrow-book',
      component: BorrowBook,
      title: 'Lập phiếu mượn'
    },
    {
      path: 'return-books',
      component: ReturnBooks,
      title: 'Trả sách'
    },
    {
      path: 'borrow-history',
      component: BorrowHistory,
      title: 'Lịch sử mượn/trả'
    },
    {
      path: 'librarian/borrows',
      component: ManageBorrows,
      title: 'Duyệt mượn/trả'
    },
    {
      path: 'overdue-books',
      component: OverdueBooks,
      title: 'Sách quá hạn'
    }

    ]
  }
];