import jwt from 'jsonwebtoken';
import env from '../config/env.config.js';

export const signAccessToken = payload => {
  return jwt.sign(payload, env.ACCESS_TOKEN, {
    expiresIn: '1y',
  });
};

export const verifyAccessToken = token => {
  return jwt.verify(token, env.ACCESS_TOKEN);
};
