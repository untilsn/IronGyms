import { randomUUID } from "crypto";

// generate QR code string duy nhất cho mỗi member
// UUID v4 — đảm bảo không bao giờ trùng lặp
export const generateQrCode = () => {
  return randomUUID();
};
