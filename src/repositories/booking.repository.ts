import { Booking } from "../models/booking.model";
import { bookings } from "../config/database";

/** Truy xuất dữ liệu đơn đặt vé. */
export class BookingRepository {
  /** Lưu đơn đặt vé mới. */
  save(booking: Booking): Booking {
    bookings.push(booking);
    return booking;
  }

  /** Lấy tất cả đơn đặt vé. */
  findAll(): Booking[] {
    return bookings;
  }

  /** Tìm đơn đặt vé theo mã đơn. */
  findById(bookingId: string): Booking | undefined {
    return bookings.find((b) => b.bookingId === bookingId);
  }
}
