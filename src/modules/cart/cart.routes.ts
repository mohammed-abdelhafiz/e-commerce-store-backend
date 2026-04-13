import { Router } from "express";
import * as cartController from "./cart.controller";
import { protect } from "../auth/middlewares/protect";

const router = Router();

router
  .route("/")
  .get(protect, cartController.getCart)
  .post(protect, cartController.addToCart)
  .delete(protect, cartController.clearCart);

router
  .route("/:productId")
  .delete(protect, cartController.removeProductFromCart)
  .put(protect, cartController.updateProductQuantity);

export default router;
