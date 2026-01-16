import mongoose from "mongoose";

// Import logger files
import logger from "../logger/logger";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    logger.error("MONGO_URI is undefined");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    logger.info("MongoDB connected");
  } catch (error) {
    logger.error("MongoDB connection error", error);
    process.exit(1);
  }
};