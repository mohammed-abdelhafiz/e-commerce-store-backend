import * as z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().min(3).max(1000),
  price: z.coerce.number().min(0),
  category: z.string().min(3).max(30),
  isFeatured: z.boolean().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
