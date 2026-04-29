import { Request, Response } from "express";
import { createCheckoutSessionSchema } from "./payment.dto";
import * as paymentService from "./payment.service";
export const createCheckoutSession = async (req: Request, res: Response) => {
  const parsedBody = createCheckoutSessionSchema.parse(req.body);
  const userId = req.user!._id.toString();
  const session = await paymentService.createCheckoutSession({
    ...parsedBody,
    userId,
  });
  res.json(session);
};

export const handleCheckoutSuccess = async (req: Request, res: Response) => {
  const { sessionId } = req.query;
  const { newOrder, newCoupon } = await paymentService.handleCheckoutSuccess(sessionId as string);
  res.json({ newOrder, newCoupon });
};
