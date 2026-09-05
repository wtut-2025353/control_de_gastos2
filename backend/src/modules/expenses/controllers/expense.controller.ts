import type { Request, Response } from "express";
import {
  createExpense,
  getExpensesByUser,
  getTotalExpenseByUser,
  getMonthlyExpenseTotals,
  getExpensesByCategory,
  deleteExpense
} from "../services/expense.service.js";

export async function createExpenseHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  try {
    const expense = await createExpense(req.user.id, req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: "Error al crear gasto" });
  }
}

export async function getExpensesHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  const expenses = await getExpensesByUser(req.user.id);
  res.json(expenses);
}

export async function getTotalExpenseHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  const total = await getTotalExpenseByUser(req.user.id);
  res.json({ total });
}

export async function getMonthlyExpenseHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  const months = Number(req.query.months) || 6;
  const totals = await getMonthlyExpenseTotals(req.user.id, months);
  res.json(totals);
}

export async function getExpensesByCategoryHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  const categories = await getExpensesByCategory(req.user.id);
  res.json(categories);
}

export async function deleteExpenseHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  try {
    const deleted = await deleteExpense(req.user.id, String(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: "Gasto no encontrado" });
      return;
    }
    res.status(204).send();
  } catch {
    res.status(400).json({ message: "Error al eliminar gasto" });
  }
}
