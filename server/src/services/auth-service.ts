import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  refreshTokenDuration,
} from "../constants";
import { generateAuthCookie } from "../utils/cookie-util";
import {
  generateAccessToken,
  generateRefreshToken,
  JwtPayload,
} from "../utils/jwt-util";

export class AuthService {
  static issueAccessTokenCookie(payload: JwtPayload): string {
    const accessToken = generateAccessToken(payload);
    return generateAuthCookie(ACCESS_TOKEN_KEY, accessToken);
  }

  static issueRefreshTokenCookie(payload: JwtPayload): string {
    const refreshToken = generateRefreshToken(payload);
    return generateAuthCookie(REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: refreshTokenDuration,
    });
  }

  static issueAuthCookies(payload: JwtPayload): string[] {
    const accessCookie = this.issueAccessTokenCookie(payload);
    const refreshCookie = this.issueRefreshTokenCookie(payload);
    return [accessCookie, refreshCookie];
  }
}
