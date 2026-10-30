import express from "express";
import cors from "cors";
import bookingRoutes from "./routes/booking.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

/** Cấu hình Express middleware và routes. */
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", bookingRoutes);

// Endpoint kiểm tra server đang hoạt động.
app.get("/", (req, res) => {
  res.json({
    message: "🎟️ Ticket Booking API is running!",
    version: "1.0.0",
    endpoints: {
      "POST /api/bookings": "Đặt vé mới",
      "GET /api/bookings": "Xem danh sách đơn đặt vé",
      "GET /api/tickets": "Xem danh sách vé và tồn kho",
    },
  });
});

// Middleware lỗi cần được đăng ký sau các routes.
app.use(errorMiddleware);

export default app;
