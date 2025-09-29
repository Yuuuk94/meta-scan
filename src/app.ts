import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "@core/http/errorHandler.js";
import { notFound } from "@core/http/notFound.js";
import { swaggerUi, swaggerSpec } from "@config/swagger.js";
import healthRouter from "@modules/health/health.router.js";
import scanRouter from "@modules/scan/scan.router.js";
import lighthouseRouter from "@modules/lighthouse/lighthouse.router.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: false,
  })
);
app.use(morgan("tiny"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/openapi.json", (_req, res) => res.json(swaggerSpec));

const routers = {
  healthz: healthRouter,
  scan: scanRouter,
  lighthouse: lighthouseRouter,
};
for (let [key, value] of Object.entries(routers)) {
  app.use("/api/v1/" + key, value);
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("mata-scan-api runner(local) on " + port);
  console.log(
    `mata-scan-api swagger(local) on http://localhost:${port}/api/docs`
  );
});

export default app;
