import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.cookies.auth_token;
  if (!authToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
  if (!decoded) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
};
