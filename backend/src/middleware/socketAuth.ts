import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const socketAuth = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const user = await User.findById(decoded.userId).select(
      "_id email role"
    );

    if (!user) {
      return next(new Error("Unauthorized"));
    }

    socket.data.user = user;

    return next();
  } catch (err) {
    return next(new Error("Unauthorized"));
  }
};