import winston from "winston";
import path from "path";
import fs from "fs";

export const getUserLogger = (
  userId: string,
  role: "user" | "admin"
) => {
  const baseDir = path.join("logs", role);

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  return winston.createLogger({
    level: "info",
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(
        ({ timestamp, level, message }) =>
          `[${timestamp}] ${level.toUpperCase()}: ${message}`
      )
    ),
    transports: [
      new winston.transports.File({
        filename: path.join(baseDir, `${userId}.log`),
      }),
    ],
  });
};