import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IngresosComponent } from './components/ingresos/ingresos.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'ingresos', component: IngresosComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
