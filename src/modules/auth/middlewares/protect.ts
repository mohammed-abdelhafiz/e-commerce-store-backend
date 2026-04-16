import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/lib/AppErrorClass";
import { verifyAccessToken } from "../../../shared/lib/tokenUtils";
import User from "../User.model";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    throw new AppError("Unauthorized", 401);
  }

  const decodedToken = verifyAccessToken(accessToken);
  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  req.user = user;
  next();
};
