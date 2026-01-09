"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser")); // It helps in resolving ref errors by creating final bundle
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({ message: "Invalid JSON payload" });
    }
    next();
});
// const swaggerPath = path.join(__dirname,"../swagger/openapi.yaml");
const swaggerPath = process.env.NODE_ENV === "production"
    ? path_1.default.join(__dirname, "swagger/openapi.yaml")
    : path_1.default.join(process.cwd(), "swagger/openapi.yaml");
app.use("/api-docs", swagger_ui_express_1.default.serve);
app.get("/api-docs", async (req, res, next) => {
    try {
        const api = await swagger_parser_1.default.bundle(swaggerPath);
        swagger_ui_express_1.default.setup(api, {
            swaggerOptions: {
                persistAuthorization: true,
            },
        })(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
// SwaggerParser.bundle(swaggerPath)
//   .then((api: any) => {
//     app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(api, {
//       swaggerOptions: {
//         persistAuthorization: true,
//       },
//     }));
//     console.log("API Docs ready at http://localhost:2209/api-docs");
//   })
//   .catch((err: unknown) => {
//     console.error("Failed to load OpenAPI spec:", err);
//   });
app.use("/api/auth", auth_routes_1.default);
app.use("/api", book_routes_1.default);
exports.default = app;
