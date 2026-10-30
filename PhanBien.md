# Giải thích Phần B và Phần C

## Phần B – Thay đổi nghiệp vụ giảm giá

### 1. Quy định nghiệp vụ

Hệ thống áp dụng giảm giá dựa trên tổng tiền trước giảm:

- Nếu tổng tiền nhỏ hơn `1.000.000 VNĐ`: không giảm giá.
- Nếu tổng tiền từ `1.000.000 VNĐ` trở lên: giảm `10%`.
- Số tiền giảm tối đa là `200.000 VNĐ`.

Công thức:

```text
discountAmount = min(totalAmount × 10%, 200.000)
finalAmount = totalAmount - discountAmount
```

### 2. Vị trí xử lý trong code

Logic giảm giá nằm trong file:

```text
src/services/discount.service.ts
```

Các hằng số nghiệp vụ:

```ts
const DISCOUNT_THRESHOLD = 1000000;
const DISCOUNT_RATE = 0.1;
const MAX_DISCOUNT = 200000;
```

Hàm tính giảm giá:

```ts
calculateDiscount(totalAmount: number): DiscountResult {
  let discountAmount = 0;

  if (totalAmount >= DISCOUNT_THRESHOLD) {
    discountAmount = Math.min(
      totalAmount * DISCOUNT_RATE,
      MAX_DISCOUNT
    );
  }

  const finalAmount = totalAmount - discountAmount;

  return {
    totalAmount,
    discountAmount,
    finalAmount,
  };
}
```

### 3. Luồng xử lý

Trong `BookingService`, hệ thống lấy giá vé từ backend rồi tính tổng tiền:

```ts
const totalAmount = ticket.price * quantity;
const discountResult = this.discountService.calculateDiscount(totalAmount);
```

Giá gửi từ frontend không được sử dụng. Điều này tránh trường hợp người dùng tự sửa giá vé trong request.

Kết quả giảm giá được lưu vào đơn hàng gồm:

- `totalAmount`: tổng tiền trước giảm.
- `discountAmount`: số tiền được giảm.
- `finalAmount`: số tiền khách phải trả sau giảm.

### 4. Các trường hợp cần kiểm thử

| Tổng tiền | Tiền giảm | Thành tiền |
|---:|---:|---:|
| 900.000 | 0 | 900.000 |
| 1.000.000 | 100.000 | 900.000 |
| 1.500.000 | 150.000 | 1.350.000 |
| 3.000.000 | 200.000 | 2.800.000 |
| 5.000.000 | 200.000 | 4.800.000 |

Lưu ý quan trọng: điều kiện là `>= 1.000.000`, không phải `> 1.000.000`.

## Phần C – Xử lý đặt vé đồng thời

### 1. Vấn đề race condition

Giả sử chỉ còn `1` vé nhưng có hai khách hàng cùng đặt `1` vé gần như cùng lúc.

Nếu hệ thống xử lý theo cách sau:

```text
1. Đọc tồn kho
2. Kiểm tra tồn kho còn đủ
3. Trừ tồn kho
```

Cả hai request có thể cùng đọc thấy tồn kho bằng `1`, cùng vượt qua bước kiểm tra và cùng tạo đơn hàng. Kết quả là hệ thống bán `2` vé trong khi chỉ còn `1` vé.

Đây là lỗi race condition.

### 2. Tình trạng hiện tại của project

Project đang sử dụng dữ liệu giả lập trong bộ nhớ:

```text
src/config/database.ts
```

Việc cập nhật tồn kho nằm trong:

```text
src/repositories/ticket.repository.ts
```

Hàm `decreaseStock` kiểm tra và trừ tồn kho liên tiếp trong cùng một Node.js process:

```ts
decreaseStock(ticketId: number, quantity: number): boolean {
  const ticket = this.findById(ticketId);
  if (!ticket) return false;

  if (ticket.stock < quantity) {
    return false;
  }

  ticket.stock -= quantity;
  return true;
}
```

Cách này phù hợp để minh họa và chạy một instance. Tuy nhiên, nó chưa giải quyết đầy đủ trường hợp chạy nhiều backend instance, vì mỗi instance có vùng nhớ và dữ liệu tồn kho riêng.

### 3. Giải pháp khi dùng database thật

Nên thực hiện cập nhật tồn kho bằng một câu lệnh atomic conditional update:

```sql
UPDATE tickets
SET stock = stock - :quantity
WHERE id = :ticketId
  AND stock >= :quantity;
```

Sau đó kiểm tra số dòng bị cập nhật:

- `1 row affected`: trừ tồn kho thành công, tiếp tục tạo đơn.
- `0 rows affected`: vé không tồn tại hoặc không đủ tồn kho, trả lỗi `409 Conflict`.

Điểm quan trọng là điều kiện `stock >= quantity` được kiểm tra ngay trong database cùng với thao tác trừ tồn kho. Vì vậy, hai request đồng thời không thể cùng trừ vượt quá số lượng thực tế.

### 4. Transaction và row lock

Một giải pháp khác là dùng transaction:

```sql
BEGIN;

SELECT stock
FROM tickets
WHERE id = :ticketId
FOR UPDATE;

-- Kiểm tra stock, sau đó trừ tồn kho và tạo booking

COMMIT;
```

`FOR UPDATE` khóa dòng vé trong lúc transaction đang xử lý. Request thứ hai phải chờ request thứ nhất hoàn tất rồi mới đọc lại tồn kho mới.

Khi tạo đơn hàng và trừ tồn kho là hai thao tác liên quan, nên đặt cả hai trong cùng transaction để tránh tình trạng đã trừ tồn kho nhưng chưa lưu được đơn hàng.

### 5. Câu trả lời ngắn khi phỏng vấn

> Em nhận diện đây là race condition. Không nên chỉ đọc tồn kho rồi mới trừ ở application, đặc biệt khi chạy nhiều backend instance. Em sẽ dùng database transaction với row-level lock `SELECT ... FOR UPDATE`, hoặc atomic conditional update `UPDATE ... SET stock = stock - quantity WHERE stock >= quantity`. Sau đó kiểm tra số dòng affected; nếu bằng 0 thì trả về lỗi hết vé. Việc trừ tồn kho và tạo booking nên nằm trong cùng transaction để đảm bảo tính nhất quán dữ liệu.


