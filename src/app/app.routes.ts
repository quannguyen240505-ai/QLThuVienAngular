import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { ResetPasswordComponent } from './pages/reset-password/reset-password';
import { SocialLoginSuccessComponent } from './pages/social-login-success/social-login-success';

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
      }
    ]
  }
];