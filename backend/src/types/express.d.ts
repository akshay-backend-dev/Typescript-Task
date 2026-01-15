import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface User {
      userId: string;
      name: string;
      email: string;
      role: "user" | "admin";
    }

    interface Request {
      user?: User;
    }
  }
}

export {};