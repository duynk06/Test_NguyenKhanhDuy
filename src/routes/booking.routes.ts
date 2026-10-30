import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  getAllTickets,
} from "../controllers/booking.controller";

/** Các endpoint của hệ thống đặt vé. */
const router = Router();

// Tạo đơn đặt vé.
router.post("/bookings", createBooking);

// Xem danh sách đơn đặt vé.
router.get("/bookings", getAllBookings);

// Xem danh sách vé và tồn kho.
router.get("/tickets", getAllTickets);

export default router;
