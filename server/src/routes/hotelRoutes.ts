import { Router } from "express";
import {
  getHotels,
  getHotelById,
  searchHotels,
  getHotelReviews,
} from "../controllers/hotelController";

const router = Router();

router.get("/", getHotels);
router.get("/search", searchHotels);
router.get("/:id", getHotelById);
router.get("/:id/reviews", getHotelReviews);

export default router;
