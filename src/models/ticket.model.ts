/** Cấu trúc dữ liệu của một loại vé. */
export interface Ticket {
  id: number;
  name: string;
  price: number; // Giá vé (VNĐ)
  stock: number; // Số lượng tồn kho
}
