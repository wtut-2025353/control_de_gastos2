import { Types } from "mongoose";
import { Income } from "../models/income.model.js";

export interface CreateIncomeData {
  description: string;
  amount: number;
  category: string;
  date?: Date;
}

export async function createIncome(userId: string, data: CreateIncomeData) {
  return Income.create({ user: new Types.ObjectId(userId), ...data, category: data.category as any });
}

export async function getIncomesByUser(userId: string) {
  return Income.find({ user: new Types.ObjectId(userId) }).sort({ date: -1 }).lean();
}

export async function getTotalIncomeByUser(userId: string) {
  const result = await Income.aggregate([
    { $match: { user: new Types.ObjectId(userId) } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result[0]?.total ?? 0;
}

export async function getMonthlyIncomeTotals(userId: string, months: number) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  startDate.setHours(0, 0, 0, 0);

  const result = await Income.aggregate([
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
