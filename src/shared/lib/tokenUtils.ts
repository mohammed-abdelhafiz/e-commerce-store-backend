import jwt from "jsonwebtoken";
import redisClient from "./redis";
import { Response } from "express";
import { Role } from "../types";

export interface JwtPayload {
  userId: string;
  role: Role;
}

export const generateTokens = (userId: string, role: Role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as unknown as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as unknown as JwtPayload;
};

export const storeRefreshTokenInRedis = async (
  userId: string,
  refreshToken: string
) => {
  await redisClient.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    60 * 60 * 24 * 7 // 7 days
  );
};

export const getRefreshTokenFromRedis = async (userId: string) => {
  return await redisClient.get(`refresh_token:${userId}`);
};

export const setTokensInCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  clearTokensCookies(res);
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};


export const clearTokensCookies = (res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
};