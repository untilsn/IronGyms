import dotenv from "dotenv";
dotenv.config({ quiet: true });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  SALT: process.env.SALT,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  ADMIN_URL: process.env.ADMIN_URL || "http://localhost:4000",
  ACCESS_TOKEN: process.env.JWT_ACCESS_SECRET,
  REFRESH_TOKEN: process.env.JWT_REFRESH_SECRET,
};
export default env;
