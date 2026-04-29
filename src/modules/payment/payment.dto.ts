import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "At least one item is required"),
  couponCode: z.string().optional(),
});

export type CreateCheckoutSessionDto = z.infer<
  typeof createCheckoutSessionSchema
>;
