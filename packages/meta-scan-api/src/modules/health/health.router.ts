import { Router } from "express";
import { HealthController } from "./HealthController.js";

const router = Router();
const controller = new HealthController();

router.get("/", controller.get);

export default router;
