import { Router } from "express";
import { ScanController } from "./scanController.js";
import { ScanService } from "./scanService.js";

const router = Router();

const service = new ScanService();
const controller = new ScanController(service);

router.post("/ping", controller.ping);

export default router;
