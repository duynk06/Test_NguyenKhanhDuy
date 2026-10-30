import { Ticket } from "../models/ticket.model";
import { Booking } from "../models/booking.model";

/** Dữ liệu giả lập lưu trong bộ nhớ của server. */

export const tickets: Ticket[] = [
  {
    id: 1,
    name: "Vé VinWonders",
    price: 750000,
    stock: 5,
  },
  {
    id: 2,
    name: "Vé Safari",
    price: 650000,
    stock: 3,
  },
];

export const bookings: Booking[] = [];

export let bookingCounter = 0;

export function incrementBookingCounter(): number {
  bookingCounter++;
  return bookingCounter;
}
