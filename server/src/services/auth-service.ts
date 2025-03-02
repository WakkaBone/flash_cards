import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";
import { generateAuthCookie } from "../utils/cookie-util";
import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
} from "../utils/jwt-util";

export const accessTokenDuration = 600; //10 minutes
export const refreshTokenDuration = 43200; //12 hours

export const AuthService = {
  issueAccessTokenCookie: function (payload: JwtPayload) {
    const accessToken = generateAccessToken(payload);
    const accessCookie = generateAuthCookie(ACCESS_TOKEN_KEY, accessToken);
    return accessCookie;
  },
  issueRefreshTokenCookie: function (payload: JwtPayload) {
    const refreshToken = generateRefreshToken(payload);
    const refreshCookie = generateAuthCookie(REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: refreshTokenDuration,
    });
    return refreshCookie;
  },
  issueAuthCookies: function (payload: JwtPayload) {
    const accessCookie = this.issueAccessTokenCookie(payload);
    const refreshCookie = this.issueRefreshTokenCookie(payload);
    return [accessCookie, refreshCookie];
  },
};
