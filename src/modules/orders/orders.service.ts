import { Types } from "mongoose";
import Order from "../payment/Order.model";

export const getAllOrders = async (skip: number, limit: number) => {
  return await Order.find()
    .populate("user")
    .populate("items.product")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
};

export const getUserOrders = async (userId: Types.ObjectId) => {
  return await Order.find({ user: userId })
    .populate("user")
    .populate("items.product")
    .sort({ createdAt: -1 });
};
