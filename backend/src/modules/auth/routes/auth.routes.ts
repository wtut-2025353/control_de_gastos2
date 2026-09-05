import { Router } from "express";
import { login, loginGoogle, refresh } from "../controllers/auth.controller.js";
import { authenticate } from "../../../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/google", loginGoogle);
router.post("/refresh", authenticate, refresh);

export default router;
