import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/bookingController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, createBooking);
router.get("/", requireAuth, getBookings);
router.get("/:id", requireAuth, getBookingById);
router.put("/:id/cancel", requireAuth, cancelBooking);

export default router;
