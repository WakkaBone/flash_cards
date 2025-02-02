import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies.auth_token;
  const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
  if (authToken && decoded) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
