// import path from "path";
// import dotenv from "dotenv";

// dotenv.config({
//   path: path.resolve(process.cwd(), ".env"),
// });

// import app from "./app";
// import { connectDB } from "./config/db";
// import logger from "./logger/logger";

// connectDB().then(() => {
//   app.listen(process.env.PORT || 2209, () => {
//     logger.info(`Server running on port ${process.env.PORT}`);
//     console.log(`Server running on port ${process.env.PORT}`);
//   });
// });



// SOCKET.IO IMPLEMENTATION
import path from "path";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

import app from "./app";
import { connectDB } from "./config/db";
import logger from "./logger/logger";
import { socketAuth } from "./middleware/socketAuth";

const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.use(socketAuth);

io.on("connection", (socket) => {
  const user = socket.data.user;

  logger.info(`Socket connected: ${socket.id} (${user.email})`);

  if (user.role === "admin") {
    socket.join("admins");
    logger.info(`Admin joined admins room: ${user.email}`);
  }

  socket.on("disconnect", () => {
    logger.warn(`Socket disconnected: ${socket.id} (${user.email})`);
  });
});

connectDB().then(() => {
  const PORT = process.env.PORT || 2209;

  httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log(`Server running on port ${PORT}`);
  });
});