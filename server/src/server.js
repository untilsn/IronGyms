import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.config.js"; // biến môi trường
import db from "./config/database.config.js"; // kết nối database
import createTables from "./db/schema.js";
// khởi tạo database — chạy trước khi làm bất cứ thứ gì
createTables();

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [env.CLIENT_URL, env.ADMIN_URL],
    credentials: true,
  }),
);

// test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// khởi động server
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
