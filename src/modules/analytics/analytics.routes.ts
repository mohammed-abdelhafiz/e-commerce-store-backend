import { Router } from "express";
import { protect } from "../auth/middlewares/protect";
import { authorizeAdmin } from "../auth/middlewares/authorizeAdmin";
import * as analyticsController from "./analytics.controller";

const router = Router();

router.get("/", protect, authorizeAdmin, analyticsController.getAnalytics);

export default router;