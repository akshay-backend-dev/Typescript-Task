"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../logger/logger"));
const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        logger_1.default.error("MONGO_URI is undefined");
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(uri);
        logger_1.default.info("MongoDB connected");
    }
    catch (error) {
        logger_1.default.error("MongoDB connection error", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
