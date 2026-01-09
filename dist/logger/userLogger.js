"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getUserLogger = (userId, role) => {
    const baseDir = path_1.default.join("logs", role);
    if (!fs_1.default.existsSync(baseDir)) {
        fs_1.default.mkdirSync(baseDir, { recursive: true });
    }
    return winston_1.default.createLogger({
        level: "info",
        format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`)),
        transports: [
            new winston_1.default.transports.File({
                filename: path_1.default.join(baseDir, `${userId}.log`),
            }),
        ],
    });
};
exports.getUserLogger = getUserLogger;
