import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/utils";
import { flattenError, ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json(flattenError(err));
  }

  res.status(500).json({
    message: "Something went wrong",
  });
};
