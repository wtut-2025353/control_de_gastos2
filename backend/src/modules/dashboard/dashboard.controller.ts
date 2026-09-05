import type { Request, Response } from "express";
import { getTotalIncomeByUser, getMonthlyIncomeTotals } from "../incomes/services/income.service.js";
import {
  getTotalExpenseByUser,
  getMonthlyExpenseTotals,
  getExpensesByCategory
} from "../expenses/services/expense.service.js";
import { getTotalBudgetByUserAndPeriod } from "../budgets/services/budget.service.js";

export async function getDashboardSummary(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }

  const userId = req.user.id;
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [
    totalIncome,
    totalExpenses,
    monthlyIncomes,
    monthlyExpenses,
    categoryBreakdown,
    totalBudget
  ] = await Promise.all([
    getTotalIncomeByUser(userId),
    getTotalExpenseByUser(userId),
    getMonthlyIncomeTotals(userId, 12),
    getMonthlyExpenseTotals(userId, 12),
    getExpensesByCategory(userId),
    getTotalBudgetByUserAndPeriod(userId, currentMonth, currentYear)
  ]);

  const balance = totalIncome - totalExpenses;
  const savings = totalIncome - totalExpenses;

  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  const prevIncome = monthlyIncomes.find((m) => m.month === previousMonth && m.year === previousYear);
  const prevExpense = monthlyExpenses.find((m) => m.month === previousMonth && m.year === previousYear);
  const currIncome = monthlyIncomes.find((m) => m.month === currentMonth && m.year === currentYear);
  const currExpense = monthlyExpenses.find((m) => m.month === currentMonth && m.year === currentYear);

  function calcVariation(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  const incomeVariation = calcVariation(
    currIncome?.total ?? 0,
    prevIncome?.total ?? 0
  );
  const expenseVariation = calcVariation(
    currExpense?.total ?? 0,
    prevExpense?.total ?? 0
  );
  const balanceVariation = calcVariation(
    (currIncome?.total ?? 0) - (currExpense?.total ?? 0),
    (prevIncome?.total ?? 0) - (prevExpense?.total ?? 0)
  );
  const savingsVariation = balanceVariation;

  const currentMonthExpenses = currExpense?.total ?? 0;
  const budgetPercentage = totalBudget > 0
    ? Math.round((currentMonthExpenses / totalBudget) * 100)
    : 0;

  res.json({
    balance,
    totalIncome,
    totalExpenses,
    savings,
    totalBudget,
    budgetSpent: currentMonthExpenses,
    budgetPercentage,
    incomeVariation,
    expenseVariation,
    balanceVariation,
    savingsVariation,
    monthlyIncomes,
    monthlyExpenses,
    categoryBreakdown
  });
}
