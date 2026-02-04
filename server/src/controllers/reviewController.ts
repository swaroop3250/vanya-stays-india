import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { HttpError } from "../utils/httpError";

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const { hotelId, rating, comment, tripType } = req.body || {};
    if (!hotelId || !rating || !comment) {
      throw new HttpError("Missing review details", 400);
    }

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) {
      throw new HttpError("Hotel not found", 404);
    }

    const review = await prisma.review.create({
      data: {
        hotelId,
        userId,
        rating: Number(rating),
        comment,
        tripType: tripType || "General",
      },
      include: { user: true },
    });

    res.status(201).json({
      id: review.id,
      userName: review.user.name,
      userAvatar: review.user.avatarUrl || undefined,
      rating: review.rating,
      date: review.createdAt.toISOString(),
      comment: review.comment,
      tripType: review.tripType,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const { rating, comment, tripType } = req.body || {};

    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review || review.userId !== userId) {
      throw new HttpError("Review not found", 404);
    }

    const updated = await prisma.review.update({
      where: { id: review.id },
      data: {
        rating: rating ? Number(rating) : review.rating,
        comment: comment || review.comment,
        tripType: tripType || review.tripType,
      },
      include: { user: true },
    });

    res.json({
      id: updated.id,
      userName: updated.user.name,
      userAvatar: updated.user.avatarUrl || undefined,
      rating: updated.rating,
      date: updated.createdAt.toISOString(),
      comment: updated.comment,
      tripType: updated.tripType,
    });
  } catch (error) {
    next(error);
  }
};
