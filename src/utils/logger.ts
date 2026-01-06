import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    ({ timestamp, level, message }) =>
      `[${timestamp}] ${level.toUpperCase()}: ${message}`
  )
);

const infoOnly = winston.format((info) =>
  info.level === "info" ? info : false
);

const warnOnly = winston.format((info) =>
  info.level === "warn" ? info : false
);

const errorOnly = winston.format((info) =>
  info.level === "error" ? info : false
);

const debugOnly = winston.format((info) =>
  info.level === "debug" ? info : false
);

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.File({
      filename: "logs/success.log",
      format: winston.format.combine(infoOnly(), logFormat),
    }),

    new winston.transports.File({
      filename: "logs/warn.log",
      format: winston.format.combine(warnOnly(), logFormat),
    }),

    new winston.transports.File({
      filename: "logs/error.log",
      format: winston.format.combine(errorOnly(), logFormat),
    }),

    new winston.transports.File({
      filename: "logs/debug.log",
      format: winston.format.combine(debugOnly(), logFormat),
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),

    new winston.transports.Console(),
  ],
});

export default logger;