import { Router } from "express";
import {
  getDestinations,
  getDestinationById,
  getHotelsByDestination,
} from "../controllers/destinationController";

const router = Router();

router.get("/", getDestinations);
router.get("/:id/hotels", getHotelsByDestination);
router.get("/:id", getDestinationById);

export default router;
