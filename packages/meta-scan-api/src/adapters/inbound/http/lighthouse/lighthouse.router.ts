import { Router } from "express";
import { ChromeLauncherAdapter } from "@/adapters/outbound/ChromeLauncherAdapter.js";
import { LighthouseService } from "@/application/LighthouseService.js";
import { LighthouseController } from "./LighthouseController.js";

const router = Router();

// 간단한 수동 DI
const chromeLauncher = new ChromeLauncherAdapter();
const service = new LighthouseService(chromeLauncher);
const controller = new LighthouseController(service);

router.post("/run", controller.run);

export default router;
