import mongoose from "mongoose";
import { env } from "./env";

import logger from "../utils/logger";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connection established");
    console.log("MongoDB connection established");
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};