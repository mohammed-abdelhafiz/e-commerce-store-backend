import { Document, Schema, Types, model } from "mongoose";

interface OrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}
interface ShippingAddress {
  name: string;
  address: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
}

interface OrderDocument extends Document {
  user: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: "paid" | "shipped" | "delivered";
  paymentId: string;
  shippingAddress: ShippingAddress;
}

const orderSchema = new Schema<OrderDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["paid", "shipped", "delivered"],
      required: true,
    },
    paymentId: { type: String, required: true },
    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      apt: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      zip: { type: String },
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ paymentId: 1 }, { unique: true });

const Order = model<OrderDocument>("Order", orderSchema);
export default Order;
