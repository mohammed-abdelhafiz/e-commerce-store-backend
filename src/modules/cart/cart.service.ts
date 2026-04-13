import { AppError } from "../../shared/lib/AppErrorClass";
import Cart from "./Cart.model";
import { Types } from "mongoose";

export const addToCart = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId
) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({ product: productId, quantity: 1 });
  }
  await cart.save();
  return cart;
};
export const getCart = async (userId: Types.ObjectId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }
  return cart;
};
export const clearCart = async (userId: Types.ObjectId) => {
  const cart = await Cart.findByIdAndDelete(userId);
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }
  return cart;
};
export const removeProductFromCart = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId
) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();
  return cart;
};
export const updateProductQuantity = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId,
  quantity: number
) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (!existingItem) {
    throw new AppError("Product not found in cart", 404);
  }

  if (quantity === 0) {
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );
  } else {
    existingItem.quantity = quantity;
  }
  await cart.save();
  return cart;
};
