import { Ticket } from "../models/ticket.model";
import { tickets } from "../config/database";

/** Truy xuất và cập nhật dữ liệu vé. */
export class TicketRepository {
  /** Lấy tất cả vé. */
  findAll(): Ticket[] {
    return tickets;
  }

  /** Tìm vé theo ID. */
  findById(id: number): Ticket | undefined {
    return tickets.find((ticket) => ticket.id === id);
  }

  /** Trừ tồn kho nếu số lượng còn lại đáp ứng yêu cầu. */
  decreaseStock(ticketId: number, quantity: number): boolean {
    const ticket = this.findById(ticketId);
    if (!ticket) return false;

    if (ticket.stock < quantity) {
      return false;
    }

    ticket.stock -= quantity;
    return true;
  }

  /** Lấy tồn kho hiện tại của vé. */
  checkStock(ticketId: number): number {
    const ticket = this.findById(ticketId);
    return ticket ? ticket.stock : 0;
  }
}
