import { CreateCheckoutSessionDto } from "./payment.dto";
import { getValidCouponByCode } from "../coupons/coupons.service";
import { stripe } from "../../shared/lib/stripe";
import Coupon from "../coupons/Coupon.model";
import { AppError } from "../../shared/lib/AppErrorClass";
import { Types } from "mongoose";
import Order from "./Order.model";

export const createCheckoutSession = async ({
  items,
  couponCode,
  userId,
}: CreateCheckoutSessionDto & { userId: Types.ObjectId }) => {
  let totalAmount = 0;
  const lineItems = items.map((item) => {
    const unitAmount = Math.round(item.price * 100);
    totalAmount += unitAmount * item.quantity;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: unitAmount,
      },
    };
  });
  let coupon = null;
  if (couponCode) {
    coupon = await getValidCouponByCode(userId.toString(), couponCode);
    if (coupon) {
      const discountAmount = Math.round(
        (totalAmount * coupon.discountPercentage) / 100
      );
      totalAmount -= discountAmount;
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    discounts: coupon
      ? [
          {
            coupon: (
              await stripe.coupons.create({
                percent_off: coupon.discountPercentage,
                duration: "once",
              })
            ).id,
          },
        ]
      : [],
    metadata: {
      userId: userId.toString(),
      couponCode: couponCode || null,
      products: JSON.stringify(items),
    },
  });

  if (totalAmount >= 20000) {
    await Coupon.create({
      user: userId,
      code: `Gift_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      discountPercentage: 10,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
  }

  return { sessionId: session.id, totalAmount: totalAmount / 100 };
};

export const handleCheckoutSuccess = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new AppError("Payment not completed", 400);
  }

  if (session.metadata?.couponCode) {
    await Coupon.findOneAndUpdate(
      { code: session.metadata.couponCode, user: session.metadata.userId },
      { $set: { isActive: false } }
    );
  }

  const order = await Order.create({
    user: session.metadata?.userId,
    items: JSON.parse(session.metadata?.products || "[]"),
    totalAmount: (session.amount_total || 0) / 100,
    stripeSessionId: session.id,
  });

  return order;
};
