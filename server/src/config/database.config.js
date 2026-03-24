import Database from "better-sqlite3"; // thư viện kết nối SQLite
import path from "path"; // module xử lý đường dẫn file
import { fileURLToPath } from "url"; // convert URL thành đường dẫn thật
import env from "./env.config.js";

// ES Module không có sẵn __dirname như CommonJS
// nên phải tự tạo lại từ import.meta.url
const __filename = fileURLToPath(import.meta.url); // đường dẫn đầy đủ tới file này
const __dirname = path.dirname(__filename); // lấy folder chứa file này

// ghép đường dẫn tới file SQLite
// __dirname = .../server/src/config
// '../db/iron_gyms.db' → .../server/src/db/iron_gyms.db
// nếu file chưa tồn tại → better-sqlite3 tự tạo mới
const dbPath = path.join(__dirname, "../db/iron_gyms.db");

// mở kết nối tới file SQLite
// verbose: console.log → in ra terminal mọi câu SQL khi chạy (chỉ dùng khi dev)
const db = new Database(dbPath);

// cho phép đọc và ghi đồng thời, tăng performance
db.pragma("journal_mode = WAL");

// SQLite mặc định tắt kiểm tra foreign key
// bật lên để đảm bảo quan hệ giữa các bảng đúng
db.pragma("foreign_keys = ON");

// cân bằng tốc độ và an toàn dữ liệu, phù hợp với WAL mode
db.pragma("synchronous = NORMAL");

console.log("✅ SQLite connected:", dbPath);

// export để dùng ở các file khác (schema, models...)
export default db;
