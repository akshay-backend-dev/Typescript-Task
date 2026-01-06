import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  // Token generated after logging in
  const token = req.headers.authorization?.split(" ")[1];

  // Check that user logged-in or not using token
  if (!token) return res.status(401).json({ message: "No token exist" });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};