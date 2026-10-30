import { Booking, CreateBookingRequest, BookingResponse } from "../models/booking.model";
import { TicketRepository } from "../repositories/ticket.repository";
import { BookingRepository } from "../repositories/booking.repository";
import { DiscountService } from "./discount.service";
import { generateBookingId } from "../utils/generate-booking-id";

/** Xử lý nghiệp vụ đặt vé và truy vấn dữ liệu liên quan. */
export class BookingService {
  private ticketRepo: TicketRepository;
  private bookingRepo: BookingRepository;
  private discountService: DiscountService;

  constructor() {
    this.ticketRepo = new TicketRepository();
    this.bookingRepo = new BookingRepository();
    this.discountService = new DiscountService();
  }

  /** Tạo đơn đặt vé sau khi kiểm tra dữ liệu và tồn kho. */
  createBooking(request: CreateBookingRequest): BookingResponse {
    const { ticketId, quantity } = request;

    // Kiểm tra các trường bắt buộc của request.
    if (ticketId === undefined || ticketId === null) {
      throw { status: 400, message: "ticketId là bắt buộc" };
    }

    if (quantity === undefined || quantity === null) {
      throw { status: 400, message: "quantity là bắt buộc" };
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw {
        status: 400,
        message: "quantity phải là số nguyên dương (>= 1)",
      };
    }

    // Lấy thông tin vé từ kho dữ liệu.
    const ticket = this.ticketRepo.findById(ticketId);
    if (!ticket) {
      throw {
        status: 404,
        message: `Không tìm thấy vé với ID = ${ticketId}`,
      };
    }

    if (ticket.stock < quantity) {
      throw {
        status: 409,
        message: `Không đủ tồn kho. Yêu cầu: ${quantity}, Còn lại: ${ticket.stock}`,
      };
    }

    // Giá vé luôn lấy từ dữ liệu backend.
    const totalAmount = ticket.price * quantity;

    const discountResult = this.discountService.calculateDiscount(totalAmount);

    // Repository kiểm tra lại tồn kho trước khi trừ.
    const stockUpdated = this.ticketRepo.decreaseStock(ticketId, quantity);
    if (!stockUpdated) {
      // Tồn kho có thể đã thay đổi sau lần kiểm tra trước đó.
      throw {
        status: 409,
        message: "Không thể đặt vé. Tồn kho đã thay đổi, vui lòng thử lại.",
      };
    }

    const booking: Booking = {
      bookingId: generateBookingId(),
      ticketId: ticket.id,
      quantity,
      totalAmount: discountResult.totalAmount,
      discountAmount: discountResult.discountAmount,
      finalAmount: discountResult.finalAmount,
      status: "CONFIRMED",
      createdAt: new Date(),
    };

    this.bookingRepo.save(booking);

    return {
      bookingId: booking.bookingId,
      ticketId: ticket.id,
      ticketName: ticket.name,
      quantity: booking.quantity,
      unitPrice: ticket.price,
      totalAmount: booking.totalAmount,
      discountAmount: booking.discountAmount,
      finalAmount: booking.finalAmount,
      status: booking.status,
      createdAt: booking.createdAt,
    };
  }

  /** Lấy danh sách đơn đặt vé. */
  getAllBookings(): Booking[] {
    return this.bookingRepo.findAll();
  }

  /** Lấy danh sách vé và tồn kho hiện tại. */
  getAllTickets() {
    return this.ticketRepo.findAll();
  }
}
