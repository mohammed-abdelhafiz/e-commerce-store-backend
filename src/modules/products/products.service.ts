import redisClient from "../../shared/lib/redis";
import { AppError } from "../../shared/lib/AppErrorClass";
import Product, { ProductDocument, ProductImage } from "./Product.model";
import { CreateProductDto, UpdateProductDto } from "./types/products.dto";

export const getAllProducts = async (skip: number, limit: number) => {
  return await Product.find().skip(skip).limit(limit);
};

export const getFeaturedProducts = async () => {
  let featuredProducts: string | null | Array<ProductDocument> =
    await redisClient.get("featured_products");
  if (!featuredProducts) {
    featuredProducts = await Product.find({ isFeatured: true }).limit(8).lean();
    await redisClient.set(
      "featured_products",
      JSON.stringify(featuredProducts)
    );
    return featuredProducts;
  }
  return JSON.parse(featuredProducts);
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return product;
};

export const createProduct = async (
  product: CreateProductDto & { image: ProductImage }
) => {
  await redisClient.del("featured_products");
  return await Product.create({
    ...product,
    price: Number(product.price),
  });
};

export const updateProduct = async (
  id: string,
  data: UpdateProductDto & { image?: ProductImage }
) => {
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  await redisClient.del("featured_products");
  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  await redisClient.del("featured_products");
  return product;
};

export const getRecommendedProducts = async () => {
  return await Product.aggregate([
    {
      $sample: {
        size: 3,
      },
    },
  ]);
};

export const getProductsByCategory = async ({
  category,
  page,
  limit,
}: {
  category: string;
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;
  return await Product.find({ category }).skip(skip).limit(limit);
};
