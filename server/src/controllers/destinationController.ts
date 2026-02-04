import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { HttpError } from "../utils/httpError";
import { resolveImageUrl } from "../utils/media";
import { mapHotel } from "../utils/mapper";

export const getDestinations = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const destinations = await prisma.destination.findMany({
      include: {
        hotels: true,
      },
    });

    const payload = destinations.map((destination) => ({
      id: destination.id,
      name: destination.name,
      state: destination.state,
      image: resolveImageUrl(destination.imageUrl),
      resortCount: destination.hotels.length,
      tagline: destination.tagline,
    }));

    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const getDestinationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: req.params.id },
      include: {
        hotels: {
          include: { roomTypes: true },
        },
      },
    });

    if (!destination) {
      throw new HttpError("Destination not found", 404);
    }

    res.json({
      id: destination.id,
      name: destination.name,
      state: destination.state,
      image: resolveImageUrl(destination.imageUrl),
      resortCount: destination.hotels.length,
      tagline: destination.tagline,
      hotels: destination.hotels.map(mapHotel),
    });
  } catch (error) {
    next(error);
  }
};

export const getHotelsByDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destination = await prisma.destination.findUnique({
      where: { id: req.params.id },
    });
    if (!destination) {
      throw new HttpError("Destination not found", 404);
    }

    const hotels = await prisma.hotel.findMany({
      where: { destinationId: destination.id },
      include: { roomTypes: true },
    });

    res.json(hotels.map(mapHotel));
  } catch (error) {
    next(error);
  }
};
