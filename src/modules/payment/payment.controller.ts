import { Request, Response } from "express";
import { createCheckoutSessionSchema } from "./payment.dto";
import * as paymentService from "./payment.service";
export const createCheckoutSession = async (req: Request, res: Response) => {
  const parsedBody = createCheckoutSessionSchema.parse(req.body);
  const userId = req.user!._id;
  const session = await paymentService.createCheckoutSession({
    ...parsedBody,
    userId,
  });
  res.json(session);
};

export const handleCheckoutSuccess = async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as string;
  const order = await paymentService.handleCheckoutSuccess(sessionId);
  res.json({
    message:
      "Payment successful, order created and coupon is deactivated if used, new coupon may be issued",
    order,
  });
};