import { incrementBookingCounter } from "../config/database";

/** Sinh mã đơn theo định dạng BK001, BK002, ... */
export function generateBookingId(): string {
  const counter = incrementBookingCounter();
  return `BK${counter.toString().padStart(3, "0")}`;
}
