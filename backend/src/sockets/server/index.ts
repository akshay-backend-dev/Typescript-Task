import { Server } from "socket.io";
import http from "http";
import { socketAuth } from "./socketAuth";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    const user = socket.data.user;

    if (user.role === "admin") {
      socket.join("admins");
    }

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};