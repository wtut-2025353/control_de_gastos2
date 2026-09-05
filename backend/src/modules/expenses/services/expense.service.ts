import { Types } from "mongoose";
import { Expense } from "../models/expense.model.js";

export interface CreateExpenseData {
  description: string;
  amount: number;
  category: string;
  date?: Date;
}

export async function createExpense(userId: string, data: CreateExpenseData) {
  return Expense.create({ user: new Types.ObjectId(userId), ...data, category: data.category as any });
}

export async function getExpensesByUser(userId: string) {
  return Expense.find({ user: new Types.ObjectId(userId) }).sort({ date: -1 }).lean();
}

export async function getTotalExpenseByUser(userId: string) {
  const result = await Expense.aggregate([
    { $match: { user: new Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result[0]?.total ?? 0;
}

export async function getMonthlyExpenseTotals(userId: string, months: number) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  startDate.setHours(0, 0, 0, 0);

  const result = await Expense.aggregate([
    { $match: { user: new Types.ObjectId(userId), date: { $gte: startDate } } },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        total: { $sum: "$amount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  return result.map((r) => ({
    month: r._id.month,
    year: r._id.year,
    total: r.total
  }));
}

export async function getExpensesByCategory(userId: string) {
  const result = await Expense.aggregate([
    { $match: { user: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" }
      }
    },
    { $sort: { total: -1 } }
  ]);

  const grandTotal = result.reduce((sum, r) => sum + r.total, 0);

  return result.map((r) => ({
    category: r._id,
    total: r.total,
    percentage: grandTotal > 0 ? Math.round((r.total / grandTotal) * 100) : 0
  }));
}

export async function deleteExpense(userId: string, expenseId: string) {
  return Expense.findOneAndDelete({ _id: expenseId, user: new Types.ObjectId(userId) });
}
