import { accessTokenDuration } from "../constants";

export const generateAuthCookie = (
  name: string,
  token: string,
  options?: {
    path?: string;
    sameSite?: string;
    maxAge?: number;
    secure?: boolean;
    httpOnly?: boolean;
  }
) => {
  const authCookie = `${name}=${token}; Path=${
    options?.path ?? "/"
  }; SameSite=${options?.sameSite ?? "None"}; Max-Age=${
    options?.maxAge ?? accessTokenDuration
  }; ${options?.secure ?? "Secure;"} ${options?.httpOnly ?? "HttpOnly;"}`;
  return authCookie;
};

export const getExpiredAuthCookie = (name: string) =>
  `${name}=; Path=/; SameSite=None; Max-Age=0; Secure`;
