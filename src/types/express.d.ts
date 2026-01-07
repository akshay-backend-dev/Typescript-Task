import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        email: string;
        role: "user" | "admin";
      };
    }
  }
}