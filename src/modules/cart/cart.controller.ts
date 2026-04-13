import { Request, Response } from "express";
import { AppError } from "../../shared/lib/utils";
import Cart from "./Cart.model";
import { isValidObjectId } from "mongoose";

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

  const cart = await Cart.findOne({ user: user._id });
  if (!cart) {
    const newCart = await Cart.create({
      user: user._id,
      items: [{ product: productId, quantity: 1 }],
    });
    return res
      .status(201)
      .json({ message: "Product added to cart", cart: newCart });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ product: productId, quantity: 1 });
  }

  await cart.save();
  res.status(200).json({ message: "Product added to cart", cart });
};

export const getCart = async (req: Request, res: Response) => {
  const user = req.user!;
  const cart = await Cart.findOne({ user: user._id }).populate("items.product");

  if (!cart) {
    return res.status(200).json({ items: [] });
  }

  res.status(200).json(cart);
};

export const clearCart = async (req: Request, res: Response) => {
  const user = req.user!;
  await Cart.findOneAndDelete({ user: user._id });
  res.status(200).json({ message: "Cart cleared successfully" });
};

export const removeProductFromCart = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const user = req.user!;

  const cart = await Cart.findOne({ user: user._id });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  res.status(200).json({ message: "Product removed from cart", cart });
};

export const updateProductQuantity = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const quantity = req.body?.quantity;
  const user = req.user!;

  if (!isValidObjectId(productId)) {
    throw new AppError("Invalid product ID", 400);
  }
  if (quantity < 0) {
    throw new AppError("Invalid quantity", 400);
  }

  const cart = await Cart.findOne({ user: user._id });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!existingItem) {
    throw new AppError("Product not found in cart", 404);
  }

  if (quantity === 0) {
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
  } else {
    existingItem.quantity = quantity;
  }
  await cart.save();

  res.status(200).json({ message: "Cart updated", cart });
};
