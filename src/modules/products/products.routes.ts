import { Router } from "express";
import * as productController from "./products.controller";
import { protect } from "../auth/middlewares/protect";
import { authorizeAdmin } from "../auth/middlewares/authorizeAdmin";
import { upload } from "../../shared/lib/cloudinary";

const router = Router();

router
  .route("/")
  .get(protect, authorizeAdmin, productController.getAllProducts)
  .post(
    protect,
    authorizeAdmin,
    upload.single("image"),
    productController.createProduct
  );

router.get("/featured", productController.getFeaturedProducts);

router.get("/recommendations", productController.getRecommendedProducts);

router.get("/category/:category", productController.getProductsByCategory);

router
  .route("/:id")
  .get(productController.getProductById)
  .put(
    protect,
    authorizeAdmin,
    upload.single("image"),
    productController.updateProduct
  )
  .delete(protect, authorizeAdmin, productController.deleteProduct);

export default router;
