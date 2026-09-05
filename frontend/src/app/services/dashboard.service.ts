import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  totalBudget: number;
  budgetSpent: number;
  budgetPercentage: number;
  incomeVariation: number;
  expenseVariation: number;
  balanceVariation: number;
  savingsVariation: number;
  monthlyIncomes: Array<{ month: number; year: number; total: number }>;
  monthlyExpenses: Array<{ month: number; year: number; total: number }>;
  categoryBreakdown: Array<{ category: string; total: number; percentage: number }>;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly api = '/api/dashboard';

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.api}/summary`);
  }
}
