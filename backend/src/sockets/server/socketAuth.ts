import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

// Import model files
import User from "../../models/User";

export const socketAuth = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    let token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Unauthorized"));

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const user = await User.findById(decoded.userId).select(
      "_id email role"
    );

    if (!user) return next(new Error("Unauthorized"));

    socket.data.user = user;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};