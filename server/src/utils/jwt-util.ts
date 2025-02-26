import jwt from "jsonwebtoken";

export type JwtPayload = { id: string; username: string };

export function generateAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
}

export function generateRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);
}

export function decodeToken(token: string) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
  }
}
