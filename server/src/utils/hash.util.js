import bcrypt from "bcrypt";
import env from "../config/env.config.JS";

const salt = env.SALT;

export const hashPassword = (password) => {
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};
