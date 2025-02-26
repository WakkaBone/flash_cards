import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";
import { generateAccessToken, JwtPayload } from "../utils/jwt-util";
import { generateAuthCookie } from "../utils/cookie-util";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies[ACCESS_TOKEN_KEY];
  const refreshToken = req.cookies[REFRESH_TOKEN_KEY];

  try {
    if (!accessToken && !refreshToken) throw new Error("Tokens are missing");

    const isAccessTokenValid =
      accessToken &&
      (jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as JwtPayload);

    if (!isAccessTokenValid) {
      const isRefreshTokenValid =
        refreshToken &&
        (jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        ) as JwtPayload);

      if (!isRefreshTokenValid) throw new Error("Refresh token is invalid");

      const newAccessToken = generateAccessToken(isRefreshTokenValid);
      const newAccessTokenCookie = generateAuthCookie(
        ACCESS_TOKEN_KEY,
        newAccessToken
      );
      res.setHeader("Set-Cookie", newAccessTokenCookie);
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error });
  }
};
