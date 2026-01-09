import express from "express";

import authRoutes from "./routes/auth.routes";
import bookRoutes from "./routes/book.routes";

import swaggerUi from "swagger-ui-express";
import SwaggerParser from "@apidevtools/swagger-parser"; // It helps in resolving ref errors by creating final bundle

import path from "path";

const app = express();
app.use(express.json());

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next();
});

const swaggerPath = path.join(__dirname,"../swagger/openapi.yaml");

SwaggerParser.bundle(swaggerPath)
  .then((api: any) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(api, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    }));
    console.log("API Docs ready at http://localhost:2209/api-docs");
  })
  .catch((err: unknown) => {
    console.error("Failed to load OpenAPI spec:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api", bookRoutes);

export default app;