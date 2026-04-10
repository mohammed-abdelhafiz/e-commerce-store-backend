import jwt from "jsonwebtoken";
import redisClient from "./redis";
import { Response } from "express";

export const generateTokens = (userId: string, role: "customer" | "admin") => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
};

export const storeRefreshTokenInRedis = async (
  userId: string,
  refreshToken: string
) => {
  await redisClient.set(
    `refresh:${userId}`,
    refreshToken,
    "EX",
    60 * 60 * 24 * 7 // 7 days
  );
};

export const getRefreshTokenFromRedis = async (userId: string) => {
  return await redisClient.get(`refresh:${userId}`);
};

export const setTokensInCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};


export const clearTokensCookies = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
};