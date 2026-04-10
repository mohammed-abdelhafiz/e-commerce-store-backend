import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/utils";
import { ReqUser } from "../types";
import { verifyAccessToken } from "../lib/tokens";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw new AppError("Unauthorized", 401);
  }

  const decodedToken = verifyAccessToken(accessToken);
  req.user = decodedToken as ReqUser;
  next();
};