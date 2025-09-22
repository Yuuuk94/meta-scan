import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "@core/http/errorHandler.js";
import { notFound } from "@core/http/notFound.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "@config/swagger.js";
import healthRouter from "@modules/health/health.router.js";
import lighthouseRouter from "@modules/lighthouse/lighthouse.router.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(cors());
app.use(morgan("tiny"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/openapi.json", (_req, res) => res.json(swaggerSpec));

app.use("/v1/healthz", healthRouter);
app.use("/v1/lighthouse", lighthouseRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
