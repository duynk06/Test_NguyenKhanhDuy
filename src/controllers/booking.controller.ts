import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import { CreateBookingRequest } from "../models/booking.model";

/** Điều phối request/response cho các API đặt vé. */
const bookingService = new BookingService();

/** Tạo đơn đặt vé mới. */
export const createBooking = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const request: CreateBookingRequest = req.body;
    const result = bookingService.createBooking(request);

    res.status(201).json({
      success: true,
      message: "Đặt vé thành công!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

/** Trả về danh sách đơn đặt vé. */
export const getAllBookings = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const bookings = bookingService.getAllBookings();

    res.status(200).json({
      success: true,
      data: bookings,
      total: bookings.length,
    });
  } catch (error: any) {
    next(error);
  }
};

/** Trả về danh sách vé và tồn kho hiện tại. */
export const getAllTickets = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const tickets = bookingService.getAllTickets();

    res.status(200).json({
      success: true,
      data: tickets,
      total: tickets.length,
    });
  } catch (error: any) {
    next(error);
  }
};
