import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { IdleService } from '../../services/idle.service';

interface Income {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  salario: 'Salario',
  freelance: 'Freelance',
  inversiones: 'Inversiones',
  regalos: 'Regalos',
  otros: 'Otros'
};

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.css'
})
export class IngresosComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly idleService = inject(IdleService);

  userName = signal('');
  mobileMenuOpen = signal(false);
  loading = signal(false);
  loadingList = signal(true);
  successMessage = signal('');
  errorMessage = signal('');
  incomes = signal<Income[]>([]);

  description = '';
  amount: number | null = null;
  category = 'otros';
  date = '';

  categories = Object.entries(CATEGORY_LABELS);

  ngOnInit(): void {
    const user = this.authService.getStoredUser();
    if (user) {
      this.userName.set(user.name.split(' ')[0]);
    }
    const today = new Date();
    this.date = today.toISOString().split('T')[0];
    this.loadIncomes();
    this.idleService.start();
  }

  ngOnDestroy(): void {
    this.idleService.stop();
  }

  loadIncomes(): void {
    this.loadingList.set(true);
    this.http.get<Income[]>('/api/incomes').subscribe({
      next: (data) => {
        this.incomes.set(data);
        this.loadingList.set(false);
      },
      error: () => {
        this.loadingList.set(false);
      }
    });
  }

  submit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.description.trim()) {
      this.errorMessage.set('Ingrese una descripcion');
      return;
    }
    if (!this.amount || this.amount <= 0) {
      this.errorMessage.set('Ingrese un monto valido');
      return;
    }

    this.loading.set(true);
    const body = {
      description: this.description.trim(),
      amount: this.amount,
      category: this.category,
      date: this.date
    };

    this.http.post<Income>('/api/incomes', body).subscribe({
      next: (created) => {
        this.incomes.update((list) => [created, ...list]);
        this.successMessage.set('Ingreso registrado correctamente');
        this.description = '';
        this.amount = null;
        this.category = 'otros';
        const today = new Date();
        this.date = today.toISOString().split('T')[0];
        this.loading.set(false);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(error?.error?.message ?? 'Error al guardar el ingreso');
      }
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.idleService.stop();
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  formatMoney(value: number): string {
    return `Q${value.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getCategoryLabel(category: string): string {
    return CATEGORY_LABELS[category] ?? category;
  }
}
