import { Router } from "express";
import { protect } from "../auth/middlewares/protect";
import { authorizeAdmin } from "../auth/middlewares/authorizeAdmin";
import * as ordersController from "./orders.controller";


const router = Router();

router.get("/", protect, authorizeAdmin, ordersController.getAllOrders);
router.get("/my-orders", protect, ordersController.getUserOrders);


export default router;