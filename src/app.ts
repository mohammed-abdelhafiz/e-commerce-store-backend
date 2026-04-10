import express from "express";
import { authRoutes } from "./routes";
import { errorHandler } from "./shared/middlewares/errorHandler.middleware";

const app = express();

// Middlewares
app.use(express.json());

// mount routes
app.use("/api/auth", authRoutes);

// error handler
app.use(errorHandler);

export default app;
