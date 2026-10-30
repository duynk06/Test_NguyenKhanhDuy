import { Request, Response, NextFunction } from "express";

/** Chuẩn hóa lỗi từ controller và service thành response API. */
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Lỗi đã được gắn mã trạng thái trong tầng nghiệp vụ.
  if (err.status) {
    res.status(err.status).json({
      success: false,
      error: {
        status: err.status,
        message: err.message,
      },
    });
    return;
  }

  // Các lỗi chưa được phân loại.
  console.error("❌ Unexpected Error:", err);
  res.status(500).json({
    success: false,
    error: {
      status: 500,
      message: "Lỗi server nội bộ. Vui lòng thử lại sau.",
    },
  });
};
