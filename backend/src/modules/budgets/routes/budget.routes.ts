import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware.js";
import {
  createBudgetHandler,
  getBudgetsHandler,
  getTotalBudgetHandler
} from "../controllers/budget.controller.js";

const router = Router();

router.post("/", authenticate, createBudgetHandler);
router.get("/", authenticate, getBudgetsHandler);
router.get("/total", authenticate, getTotalBudgetHandler);

export default router;
