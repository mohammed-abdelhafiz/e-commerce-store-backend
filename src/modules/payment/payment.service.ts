import { stripe } from "../../shared/lib/stripe";
import { CreateCheckoutSessionDto } from "./payment.dto";
import { validateCoupon } from "../coupons/coupons.service";
import { AppError } from "../../shared/lib/AppErrorClass";
import Coupon from "../coupons/Coupon.model";
import Order from "./Order.model";
import Product from "../products/Product.model";
import { SUPPORTED_COUNTRIES } from "./payment.constants";
import * as cartService from "../cart/cart.service";
import { Types } from "mongoose";

export const createCheckoutSession = async ({
  items,
  couponCode,
  userId,
}: CreateCheckoutSessionDto & { userId: string }) => {
  const populatedProducts = await populateProducts(items);
  const coupon = couponCode ? await validateCoupon(couponCode, userId) : null;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: populatedProducts.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image.url],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    discounts: coupon ? [{ coupon: coupon.stripeCouponId }] : [],
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: [...SUPPORTED_COUNTRIES],
    },
    success_url: `${process.env.CLIENT_URL}/success-checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,//Bug here
    metadata: {
      userId,
      couponCode: couponCode || "",
      items: JSON.stringify(
        populatedProducts.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        }))
      ),
    },
  });

  return { url: session.url, id: session.id };
};

export const handleCheckoutSuccess = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session?.metadata)
    throw new AppError("Session or metadata not found", 404);
  if (session.payment_status !== "paid")
    throw new AppError("Payment not successful", 400);
  if (!session.amount_total)
    throw new AppError("Amount missing from session", 400);

  const paymentId = session.payment_intent as string;

  const { couponCode, userId, items: rawItems } = session.metadata;
  if (!rawItems) throw new AppError("Items not found in session metadata", 400);
  const items = JSON.parse(rawItems);

  if (
    !session.collected_information?.shipping_details ||
    !session.collected_information?.shipping_details.address
  ) {
    throw new AppError("Shipping details missing from session", 400);
  }

  const shippingDetails = session.collected_information.shipping_details;
  const address = shippingDetails.address;

  // Fetch and validate products BEFORE the transaction
  const populatedItems = await populateProducts(items);

  const mongoSession = await Order.startSession();
  mongoSession.startTransaction();

  try {
    // ✅ Check INSIDE the transaction so it's atomic
    const existingOrder = await Order.findOne({ paymentId }, null, {
      session: mongoSession,
    });
    if (existingOrder) {
      await mongoSession.abortTransaction();
      return { newOrder: existingOrder, newCoupon: null };
    }
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode, user: userId, isActive: true },
        { isActive: false },
        { session: mongoSession }
      );
    }

    const existingActiveCoupon = await Coupon.findOne(
      { user: userId, isActive: true },
      null,
      { session: mongoSession }
    );

    let newCoupon = null;

    if (!existingActiveCoupon && (session.amount_subtotal || 0) >= 10000) {
      // give him 10% coupon for next purchase if he spent 100$ or more
      const stripeCoupon = await stripe.coupons.create({
        percent_off: 10,
        duration: "once",
      });

      newCoupon = await Coupon.findOneAndUpdate(
        { user: userId },
        {
          $set: {
            code: `GIFT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            discountPercentage: 10,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            stripeCouponId: stripeCoupon.id,
            isActive: true,
          },
        },
        { upsert: true, new: true, session: mongoSession }
      );
    }

    const [newOrder] = await Order.create(
      [
        {
          user: userId,
          items: populatedItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: session.amount_total / 100,
          status: "paid",
          paymentId,
          shippingAddress: {
            name: shippingDetails.name || "",
            address: address.line1 || "",
            apt: address.line2 || undefined,
            city: address.city || "",
            state: address.state || "",
            zip: address.postal_code || "",
          },
        },
      ],
      { session: mongoSession }
    );

    await mongoSession.commitTransaction();

    return { newOrder, newCoupon };
  } catch (err: any) {
    await mongoSession.abortTransaction();
    if (err.code === 11000 && err.keyPattern?.paymentId) {
      // Duplicate payment — idempotent, just return the existing order
      const existingOrder = await Order.findOne({ paymentId });
      return { newOrder: existingOrder, newCoupon: null };
    }
    throw err;
  } finally {
    mongoSession.endSession();
  }
};

async function populateProducts(items: CreateCheckoutSessionDto["items"]) {
  const products = await Product.find({
    _id: { $in: items.map((item) => item.productId) },
  }).lean();

  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  return items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product)
      throw new AppError(`Product ${item.productId} not found`, 404);
    return { ...product, quantity: item.quantity };
  });
}
