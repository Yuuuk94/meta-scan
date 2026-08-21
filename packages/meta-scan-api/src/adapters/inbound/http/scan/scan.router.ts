import { Router } from "express";
import { ScanController } from "./ScanController.js";
import { ScanService } from "@/application/ScanService.js";
import { PuppeteerAdapter } from "@/adapters/outbound/PuppeteerAdapter.js";

const router = Router();

const launcher = new PuppeteerAdapter();

const service = new ScanService(launcher);
const controller = new ScanController(service);

router.post("/ping", controller.ping);
router.post("/robotsTxt", controller.robotsTxt);
router.post("/siteMap", controller.siteMap);
router.post("/crawling", controller.crawling);

export default router;
