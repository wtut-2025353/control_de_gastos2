import { Types } from "mongoose";
import { Budget } from "../models/budget.model.js";

export interface CreateBudgetData {
  category: string;
  amount: number;
  month: number;
  year: number;
}

export async function createOrUpdateBudget(userId: string, data: CreateBudgetData) {
  return Budget.findOneAndUpdate(
    { user: new Types.ObjectId(userId), category: data.category as any, month: data.month, year: data.year },
    { amount: data.amount },
    { upsert: true, new: true }
  );
}

export async function getBudgetsByUserAndPeriod(userId: string, month: number, year: number) {
  return Budget.find({ user: new Types.ObjectId(userId), month, year }).lean();
}

export async function getTotalBudgetByUserAndPeriod(userId: string, month: number, year: number) {
  const result = await Budget.aggregate([
    { $match: { user: new Types.ObjectId(userId), month, year } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result[0]?.total ?? 0;
}
