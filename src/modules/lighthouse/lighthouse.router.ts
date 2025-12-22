import { Router } from "express";
import { ChromeLauncher } from "@infra/ChromeLauncher.js";
import { LighthouseService } from "./LighthouseService.js";
import { LighthouseController } from "./LighthouseController.js";

const router = Router();

// 간단한 수동 DI
const chromeLauncher = new ChromeLauncher();
const service = new LighthouseService(chromeLauncher);
const controller = new LighthouseController(service);

router.post("/run", controller.run);

export default router;
