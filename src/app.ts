import express from "express";
import {
  authRoutes,
  productRoutes,
  cartRoutes,
  couponRoutes,
  paymentRoutes,
} from "./routes";
import { errorHandler } from "./shared/middlewares/errorHandler";
import cookieParser from "cookie-parser";
import { notFoundHandler } from "./shared/middlewares/notFoundHandler";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// mount routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);

//not found
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

export default app;
