"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: path_1.default.resolve(process.cwd(), ".env"),
});
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const logger_1 = __importDefault(require("./logger/logger"));
(0, db_1.connectDB)().then(() => {
    app_1.default.listen(process.env.PORT || 2209, () => {
        logger_1.default.info(`Server running on port ${process.env.PORT}`);
        console.log(`Server running on port ${process.env.PORT}`);
    });
});
