import { Router } from "express";
import { createReview, updateReview } from "../controllers/reviewController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, createReview);
router.put("/:id", requireAuth, updateReview);

export default router;
