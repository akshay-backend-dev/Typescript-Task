import express from "express";

import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/book.routes";


import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import yaml from "yaml";

const app = express();

app.use(express.json());

// Global JSON parse error handler
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next();
});

// Swagger setup
const swaggerPath = path.join(__dirname, "../documentation.yaml");
const file = fs.readFileSync(swaggerPath, "utf8");
const swaggerDocument = yaml.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", bookRoutes);

export default app;