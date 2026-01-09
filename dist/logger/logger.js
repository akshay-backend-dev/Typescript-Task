"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`));
const infoOnly = winston_1.default.format((info) => info.level === "info" ? info : false);
const warnOnly = winston_1.default.format((info) => info.level === "warn" ? info : false);
const errorOnly = winston_1.default.format((info) => info.level === "error" ? info : false);
const debugOnly = winston_1.default.format((info) => info.level === "debug" ? info : false);
const logger = winston_1.default.createLogger({
    level: "debug",
    transports: [
        new winston_1.default.transports.File({
            filename: "logs/success.log",
            format: winston_1.default.format.combine(infoOnly(), logFormat),
        }),
        new winston_1.default.transports.File({
            filename: "logs/warn.log",
            format: winston_1.default.format.combine(warnOnly(), logFormat),
        }),
        new winston_1.default.transports.File({
            filename: "logs/error.log",
            format: winston_1.default.format.combine(errorOnly(), logFormat),
        }),
        new winston_1.default.transports.File({
            filename: "logs/debug.log",
            format: winston_1.default.format.combine(debugOnly(), logFormat),
        }),
        new winston_1.default.transports.File({
            filename: "logs/combined.log",
        }),
        new winston_1.default.transports.Console(),
    ],
});
exports.default = logger;
