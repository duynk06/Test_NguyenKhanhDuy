/** Tính số tiền giảm và số tiền cuối cùng của đơn hàng. */

const DISCOUNT_THRESHOLD = 1000000;
const DISCOUNT_RATE = 0.1;
const MAX_DISCOUNT = 200000;

export interface DiscountResult {
  totalAmount: number;    // Tổng tiền trước giảm
  discountAmount: number; // Số tiền được giảm
  finalAmount: number;    // Tổng tiền sau giảm
}

export class DiscountService {
  /** Áp dụng giảm giá theo tổng tiền trước giảm. */
  calculateDiscount(totalAmount: number): DiscountResult {
    let discountAmount = 0;

    if (totalAmount >= DISCOUNT_THRESHOLD) {
      discountAmount = Math.min(totalAmount * DISCOUNT_RATE, MAX_DISCOUNT);
    }

    const finalAmount = totalAmount - discountAmount;

    return {
      totalAmount,
      discountAmount,
      finalAmount,
    };
  }
}
