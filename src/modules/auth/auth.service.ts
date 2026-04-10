import User from "./models/User.model";
import type { LoginDto, RegisterDto } from "./types/auth.dto";
import { AppError } from "../../shared/lib/utils";
import {
  generateTokens,
  storeRefreshTokenInRedis,
} from "../../shared/lib/tokens";
import { ReqUser, Role } from "../../shared/types";
import redisClient from "../../shared/lib/redis";

export const register = async (body: RegisterDto) => {
  const { name, email, password } = body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
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
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401);
  }
  const { accessToken, refreshToken } = generateTokens(
    user._id.toString(),
    user.role as Role
  );
  await storeRefreshTokenInRedis(user._id.toString(), refreshToken);
  return { user, accessToken, refreshToken };
};

export const logout = async (user: ReqUser) => {
  await redisClient.del(`refresh:${user.id}`);
};
