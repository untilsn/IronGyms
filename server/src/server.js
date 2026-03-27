import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import env from "./config/env.config.js"; // biến môi trường
import createTables from "./db/schema.js";
import seedData from "./db/seed.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import mainRouter from "./routes/main.router.js";
// khởi tạo database — chạy trước khi làm bất cứ thứ gì
createTables();
seedData();
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
app.use("/api", mainRouter);
app.use(errorMiddleware);

// khởi động server
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
