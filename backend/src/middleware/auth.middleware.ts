import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Import logger files
import logger from "../logger/logger";

interface JwtPayload {
  userId: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("Authorization header missing or malformed");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    logger.error("Invalid token");
    return res.status(401).json({ message: "Invalid token" });
  }
};