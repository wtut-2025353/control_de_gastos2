import type { Request, Response } from "express";
import {
  createIncome,
  getIncomesByUser,
  getTotalIncomeByUser,
  getMonthlyIncomeTotals
} from "../services/income.service.js";

export async function createIncomeHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  try {
    const income = await createIncome(req.user.id, req.body);
    res.status(201).json(income);
  } catch (error) {
    res.status(400).json({ message: "Error al crear ingreso" });
  }
}

export async function getIncomesHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  const incomes = await getIncomesByUser(req.user.id);
  res.json(incomes);
}

export async function getTotalIncomeHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  const total = await getTotalIncomeByUser(req.user.id);
  res.json({ total });
}

export async function getMonthlyIncomeHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: "No autorizado" });
    return;
  }
  const months = Number(req.query.months) || 6;
  const totals = await getMonthlyIncomeTotals(req.user.id, months);
  res.json(totals);
}
