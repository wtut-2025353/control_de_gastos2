import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware.js";
import {
  createIncomeHandler,
  getIncomesHandler,
  getTotalIncomeHandler,
  getMonthlyIncomeHandler
} from "../controllers/income.controller.js";

const router = Router();

router.post("/", authenticate, createIncomeHandler);
router.get("/", authenticate, getIncomesHandler);
router.get("/total", authenticate, getTotalIncomeHandler);
router.get("/monthly", authenticate, getMonthlyIncomeHandler);

export default router;
