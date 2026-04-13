import type { Request, Response } from "express";
import { registerSchema, loginSchema } from "./types/auth.dto";
import * as authService from "./auth.service";
import {
  clearTokensCookies,
  setTokensInCookies,
} from "../../shared/lib/tokenUtils";
import { AppError } from "../../shared/lib/AppErrorClass";

export const register = async (req: Request, res: Response) => {
  const parsedBody = registerSchema.parse(req.body);
  const { user, accessToken, refreshToken } =
    await authService.register(parsedBody);
  setTokensInCookies(res, accessToken, refreshToken);
  res.status(201).json({
    message: "User registered successfully",
    user,
  });
};

export const login = async (req: Request, res: Response) => {
  const parsedBody = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } =
    await authService.login(parsedBody);
  setTokensInCookies(res, accessToken, refreshToken);
  res.status(200).json({
    message: "User logged in successfully",
    user,
  });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("No refresh token found", 401);
  }
  await authService.logout(req.user!._id.toString());
  clearTokensCookies(res);
  res.status(200).json({
    message: "User logged out successfully",
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("No refresh token provided", 401);
  }
  const { newAccessToken, newRefreshToken } =
    await authService.refresh(refreshToken);
  setTokensInCookies(res, newAccessToken, newRefreshToken);
  res.status(200).json({
    message: "Tokens refreshed successfully",
  });
};

export const getMe = async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const user = await authService.getMe(userId);
  res.status(200).json({
    message: "User fetched successfully",
    user,
  });
};
