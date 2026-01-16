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
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";

import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

// Import logger files
import logger from "./logger/logger";

// Import socket main file
import { initSocket } from "./sockets/server";

const server = http.createServer(app);

connectDB().then(() => {
  initSocket(server);

  const PORT = process.env.PORT || 2209;
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log(`Server running on port ${PORT}`);
  });
});