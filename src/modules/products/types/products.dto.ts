import * as z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().min(3).max(1000),
  price: z
    .number()
    .min(0, "Price must be at least 0")
    .or(z.string())
    .refine((val) => Number(val) >= 0, "Price must be at least 0"),
  category: z.enum([
    "Jeans",
    "T-shirts",
    "Shoes",
    "Glasses",
    "Jackets",
    "Suits",
    "Bags",
    "other",
  ]),
  isFeatured: z
    .preprocess((val) => {
      if (typeof val === "string") return val === "true";
      return val;
    }, z.boolean())
    .optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
