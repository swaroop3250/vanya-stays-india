import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { HttpError } from "../utils/httpError";
import { mapHotel } from "../utils/mapper";

export const getHotels = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await prisma.hotel.findMany({
      include: { roomTypes: true },
    });
    res.json(hotels.map(mapHotel));
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: req.params.id },
      include: { roomTypes: true },
    });
    if (!hotel) {
      throw new HttpError("Hotel not found", 404);
    }
    res.json(mapHotel(hotel));
  } catch (error) {
    next(error);
  }
};

export const searchHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const location = String(req.query.location || "").trim();
    if (!location) {
      return res.json([]);
    }

    const hotels = await prisma.hotel.findMany({
      where: {
        OR: [
          { city: { contains: location, mode: "insensitive" } },
          { state: { contains: location, mode: "insensitive" } },
          { destination: { name: { contains: location, mode: "insensitive" } } },
        ],
      },
      include: { roomTypes: true },
    });

    res.json(hotels.map(mapHotel));
  } catch (error) {
    next(error);
  }
};

export const getHotelReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: req.params.id },
    });
    if (!hotel) {
      throw new HttpError("Hotel not found", 404);
    }

    const reviews = await prisma.review.findMany({
      where: { hotelId: hotel.id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(
      reviews.map((review) => ({
        id: review.id,
        userName: review.user.name,
        userAvatar: review.user.avatarUrl || undefined,
        rating: review.rating,
        date: review.createdAt.toISOString(),
        comment: review.comment,
        tripType: review.tripType,
      }))
    );
  } catch (error) {
    next(error);
  }
};
