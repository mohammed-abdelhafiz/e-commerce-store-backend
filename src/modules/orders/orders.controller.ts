import { Request, Response } from "express";
import * as ordersService from "./orders.service";

export const getAllOrders = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 5);
  const skip = (page - 1) * limit;

  // Fetch limit + 1 to check if there's a next page
  const orders = await ordersService.getAllOrders(skip, limit + 1);
  const hasMore = orders.length > limit;
  const nextPage = hasMore ? page + 1 : undefined;

  // Return only the requested number of orders
  const ordersToReturn = hasMore ? orders.slice(0, limit) : orders;

  res.status(200).json({
    message: "Orders fetched successfully",
    orders: ordersToReturn,
    nextPage,
  });
};

export const getUserOrders = async (req: Request, res: Response) => {
  const user = req.user!;
  const userOrders = await ordersService.getUserOrders(user._id);

  res.status(200).json({
    message: "Orders fetched successfully",
    orders: userOrders,
  });
};
