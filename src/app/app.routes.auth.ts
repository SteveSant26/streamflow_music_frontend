import { Routes } from '@angular/router';
import { LoginComponent } from './presentation/pages/auth/login/login';
import { RegisterComponent } from './presentation/pages/auth/register/register';
import { ResetPasswordComponent } from './presentation/pages/auth/reset-password/reset-password';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];
