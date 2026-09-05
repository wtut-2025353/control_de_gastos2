import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware.js";
import {
  createExpenseHandler,
  getExpensesHandler,
  getTotalExpenseHandler,
  getMonthlyExpenseHandler,
  getExpensesByCategoryHandler,
  deleteExpenseHandler
} from "../controllers/expense.controller.js";

const router = Router();

router.post("/", authenticate, createExpenseHandler);
router.get("/", authenticate, getExpensesHandler);
router.get("/total", authenticate, getTotalExpenseHandler);
router.get("/monthly", authenticate, getMonthlyExpenseHandler);
router.get("/by-category", authenticate, getExpensesByCategoryHandler);
router.delete("/:id", authenticate, deleteExpenseHandler);

export default router;
