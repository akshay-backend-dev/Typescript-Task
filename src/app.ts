import express from "express";
import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/book.routes";

// To run yaml file
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import yaml from "yaml";

const app = express();

app.use(express.json());

// Path  for swagger editor
const swaggerPath = path.join(__dirname, "../documentation.yaml");
const file = fs.readFileSync(swaggerPath, "utf8");
const swaggerDocument = yaml.parse(file);

// Route to see yaml file in swagger editor on crome
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth routes (login & signup)
app.use("/api/auth", authRoutes);

// Book routes (add,read,update,delete)
app.use("/api", bookRoutes);

export default app;