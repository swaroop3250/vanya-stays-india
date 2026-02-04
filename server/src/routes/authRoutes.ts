import { Router } from "express";
import {
  signup,
  login,
  logout,
  me,
  refresh,
} from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);
router.post("/refresh", refresh);

export default router;
