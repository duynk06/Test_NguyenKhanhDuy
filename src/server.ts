import app from "./app";

/** Điểm khởi động HTTP server. */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📋 API Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/bookings  → Đặt vé`);
  console.log(`   GET  http://localhost:${PORT}/api/bookings  → Xem đơn đặt vé`);
  console.log(`   GET  http://localhost:${PORT}/api/tickets   → Xem danh sách vé\n`);
});
