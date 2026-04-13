import { Request, Response } from "express";
import { AppError } from "../../shared/lib/utils";
import { isValidObjectId, Types } from "mongoose";
import * as cartService from "./cart.service";

export const addToCart = async (req: Request, res: Response) => {
  const productId = req.body?.productId;
  if (!productId) {
    throw new AppError("Product ID is required", 400);
  }
  if (!isValidObjectId(productId)) {
    throw new AppError("Invalid product ID", 400);
  }
  const user = req.user;
  if (!user) {
    throw new AppError("User is not authenticated", 401);
  }

  const cart = await cartService.addToCart(user._id, productId);
  res.status(200).json({ message: "Product added to cart", cart });
};

export const getCart = async (req: Request, res: Response) => {
  const user = req.user!;
  const cart = await cartService.getCart(user._id);
  res.status(200).json(cart);
};

export const clearCart = async (req: Request, res: Response) => {
  const user = req.user!;
  await cartService.clearCart(user._id);
  res.status(200).json({ message: "Cart cleared successfully" });
};

export const removeProductFromCart = async (req: Request, res: Response) => {
  const productId = req.params.productId as unknown as Types.ObjectId;
  const user = req.user!;

  if (!isValidObjectId(productId)) {
    throw new AppError("Invalid product ID", 400);
  }

  const cart = await cartService.removeProductFromCart(user._id, productId);
  res.status(200).json({ message: "Product removed from cart", cart });
};

export const updateProductQuantity = async (req: Request, res: Response) => {
  const productId = req.params.productId as unknown as Types.ObjectId;
  const quantity = req.body?.quantity;
  const user = req.user!;

  if (!isValidObjectId(productId)) {
    throw new AppError("Invalid product ID", 400);
  }
  if (quantity < 0) {
    throw new AppError("Invalid quantity", 400);
  }

  const cart = await cartService.updateProductQuantity(user._id, productId, quantity);

  res.status(200).json({ message: "Cart updated", cart });
};
