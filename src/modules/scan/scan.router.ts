import { Router } from "express";
import { ScanController } from "./scanController.js";
import { ScanService } from "./scanService.js";
import { Puppeteer } from "@infra/Puppeteer.js";

const router = Router();

const launcher = new Puppeteer();

const service = new ScanService(launcher);
const controller = new ScanController(service);

router.post("/ping", controller.ping);
router.post("/robotsTxt", controller.robotsTxt);
router.post("/crawling", controller.crawling);

export default router;
