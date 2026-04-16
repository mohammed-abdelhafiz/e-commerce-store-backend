import User from "./User.model";
import type { LoginDto, RegisterDto } from "./types/auth.dto";
import { AppError } from "../../shared/lib/AppErrorClass";
import {
  generateTokens,
  storeRefreshTokenInRedis,
  verifyRefreshToken,
} from "../../shared/lib/tokenUtils";
import { Role } from "../../shared/types";
import redisClient from "../../shared/lib/redis";

export const register = async (body: RegisterDto) => {
  const { name, email, password } = body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("You already have an account, try to login", 400);
  }

  const user = await User.create({ name, email, password });
  const { accessToken, refreshToken } = generateTokens(
    user._id.toString(),
    user.role as Role
  );
  await storeRefreshTokenInRedis(user._id.toString(), refreshToken);
  return { user, accessToken, refreshToken };
};

export const login = async (body: LoginDto) => {
  const { email, password } = body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }
  const { accessToken, refreshToken } = generateTokens(
    user._id.toString(),
    user.role as Role
  );
  await storeRefreshTokenInRedis(user._id.toString(), refreshToken);
  return { user, accessToken, refreshToken };
};

export const logout = async (userId: string) => {
  await redisClient.del(`refresh_token:${userId}`);
};

export const refresh = async (oldRefreshToken: string) => {
  const { userId, role } = verifyRefreshToken(oldRefreshToken);
  const storedRefreshToken = await redisClient.get(`refresh_token:${userId}`);
  if (!storedRefreshToken || storedRefreshToken !== oldRefreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }
  const { accessToken, refreshToken } = generateTokens(userId, role);
  await storeRefreshTokenInRedis(userId, refreshToken);
  return { newAccessToken: accessToken, newRefreshToken: refreshToken };
};

export const getSession = async (refreshToken: string) => {
  const { userId, role } = verifyRefreshToken(refreshToken);
  const storedRefreshToken = await redisClient.get(`refresh_token:${userId}`);
  if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }
  return { userId, role };
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
