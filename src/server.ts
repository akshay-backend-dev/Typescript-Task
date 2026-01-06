import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

import logger from "./utils/logger";

connectDB().then(() => {
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`)
    console.log(`Server running on port ${env.PORT}`);
  });
});