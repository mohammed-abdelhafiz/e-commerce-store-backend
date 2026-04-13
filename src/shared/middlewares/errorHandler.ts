import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/utils";
import { flattenError, ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error path:", req.path);
  console.error("Error details:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: flattenError(err),
    });
  }

  // Handle Multer errors explicitly if needed
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      message: "Too many files uploaded or unexpected field name",
    });
  }

  res.status(err.status || err.statusCode || 500).json({
    message: err.message || "Something went wrong",
  });
};
