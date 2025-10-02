import { Router } from "express";
import { ScanController } from "./scanController.js";
import { ScanService } from "./scanService.js";
import { ChromeLauncher } from "@infra/ChromeLauncher.js";

const router = Router();

const launcher = new ChromeLauncher();
const service = new ScanService(launcher);
const controller = new ScanController(service);

router.post("/ping", controller.ping);
router.post("/robotsTxt", controller.robotsTxt);

export default router;
