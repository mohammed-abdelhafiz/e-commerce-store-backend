import type { Request, Response } from "express";
import * as productsService from "./products.service";
import mongoose from "mongoose";
import { AppError } from "../../shared/lib/AppErrorClass";
import { createProductSchema, updateProductSchema } from "./types/products.dto";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../shared/lib/cloudinary";

export const getAllProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const products = await productsService.getAllProducts(page, limit);
  res.status(200).json({
    message: "Products fetched successfully",
    products,
  });
};

export const createProduct = async (req: Request, res: Response) => {
  const parsedBody = createProductSchema.parse(req.body);
  const imageInMemory = req.file;
  if (!imageInMemory) {
    throw new AppError("Image is required", 400);
  }
  const result = await uploadToCloudinary(imageInMemory.buffer);
  const product = await productsService.createProduct({
    ...parsedBody,
    image: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });
  res.status(201).json({
    message: "Product created successfully",
    product,
  });
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  const products = await productsService.getFeaturedProducts();
  res.status(200).json({
    message: "Featured products fetched successfully",
    products,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw new AppError(
      "Invalid product ID format - must be a valid ObjectId",
      400
    );
  }
  const product = await productsService.getProductById(id);
  res.status(200).json({
    message: "Product fetched successfully",
    product,
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw new AppError("Invalid product ID", 400);
  }

  const parsedBody = updateProductSchema.parse(req.body);
  const existingProduct = await productsService.getProductById(id);

  let imageData;
  if (req.file) {
    // Delete old image
    if (existingProduct.image?.public_id) {
      await deleteFromCloudinary(existingProduct.image.public_id);
    }
    // Upload new image
    const result = await uploadToCloudinary(req.file.buffer);
    imageData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const updatedProduct = await productsService.updateProduct(id, {
    ...parsedBody,
    ...(imageData && { image: imageData }),
  });

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const isValidId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidId) {
    throw new AppError("Invalid product ID", 400);
  }

  const product = await productsService.getProductById(id);
  if (product.image?.public_id) {
    await deleteFromCloudinary(product.image.public_id);
  }

  await productsService.deleteProduct(id);

  res.status(200).json({
    message: "Product deleted successfully",
  });
};

export const getRecommendedProducts = async (req: Request, res: Response) => {
  const products = await productsService.getRecommendedProducts();
  res.status(200).json({
    message: "Recommended products fetched successfully",
    products,
  });
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const category = req.params.category as string;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const products = await productsService.getProductsByCategory({
    category,
    page,
    limit,
  });
  res.status(200).json({
    message: "Products fetched successfully",
    products,
  });
};
