import jwt from "jsonwebtoken";

export type JwtPayload = { username: string };

export function generateAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
}

export function generateRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
}
