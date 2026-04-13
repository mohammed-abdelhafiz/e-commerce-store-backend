import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  items: z
    .array(
      z.object({
        _id: z.string(),
        name: z.string(),
        price: z.number(),
        image: z.string(),
        quantity: z.number(),
      })
    )
    .length(1, "At least one item is required"),
  couponCode: z.string().optional(),
});

export type CreateCheckoutSessionDto = z.infer<typeof createCheckoutSessionSchema>;
