import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { HttpError } from "../utils/httpError";

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const { hotelId, checkIn, checkOut, guests, rooms, totalAmount, gstAmount } = req.body || {};
    if (!hotelId || !checkIn || !checkOut || !guests || !rooms) {
      throw new HttpError("Missing booking details", 400);
    }

    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });
    if (!hotel) {
      throw new HttpError("Hotel not found", 404);
    }

    const booking = await prisma.booking.create({
      data: {
        userId,
        hotelId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: Number(guests),
        rooms: Number(rooms),
        totalAmount: Number(totalAmount || 0),
        gstAmount: Number(gstAmount || 0),
        status: "confirmed",
      },
    });

    res.status(201).json({
      id: booking.id,
      resortId: booking.hotelId,
      resortName: hotel.name,
      userId: booking.userId,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      guests: booking.guests,
      rooms: booking.rooms,
      totalAmount: booking.totalAmount,
      gstAmount: booking.gstAmount,
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { hotel: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(
      bookings.map((booking) => ({
        id: booking.id,
        resortId: booking.hotelId,
        resortName: booking.hotel.name,
        userId: booking.userId,
        checkIn: booking.checkIn.toISOString(),
        checkOut: booking.checkOut.toISOString(),
        guests: booking.guests,
        rooms: booking.rooms,
        totalAmount: booking.totalAmount,
        gstAmount: booking.gstAmount,
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { hotel: true },
    });

    if (!booking || booking.userId !== userId) {
      throw new HttpError("Booking not found", 404);
    }

    res.json({
      id: booking.id,
      resortId: booking.hotelId,
      resortName: booking.hotel.name,
      userId: booking.userId,
      checkIn: booking.checkIn.toISOString(),
      checkOut: booking.checkOut.toISOString(),
      guests: booking.guests,
      rooms: booking.rooms,
      totalAmount: booking.totalAmount,
      gstAmount: booking.gstAmount,
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError("Unauthorized", 401);
    }

    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking || booking.userId !== userId) {
      throw new HttpError("Booking not found", 404);
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "cancelled" },
    });

    res.json({
      id: updated.id,
      status: updated.status,
    });
  } catch (error) {
    next(error);
  }
};
