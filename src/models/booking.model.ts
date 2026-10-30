/** Cấu trúc dữ liệu của một đơn đặt vé. */
export interface Booking {
  bookingId: string;
  ticketId: number;
  quantity: number;
  totalAmount: number;    // Tổng tiền trước giảm giá
  discountAmount: number; // Số tiền được giảm
  finalAmount: number;    // Tổng tiền sau giảm giá
  status: "CONFIRMED";
  createdAt: Date;
}

/** Dữ liệu nhận từ request tạo đơn. */
export interface CreateBookingRequest {
  ticketId: number;
  quantity: number;
}

/** Dữ liệu trả về sau khi tạo đơn thành công. */
export interface BookingResponse {
  bookingId: string;
  ticketId: number;
  ticketName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: "CONFIRMED";
  createdAt: Date;
}
