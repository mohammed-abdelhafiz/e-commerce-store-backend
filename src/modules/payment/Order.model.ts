import { Document, Schema, Types, model } from "mongoose";

interface OrderDocument extends Document {
  user: Types.ObjectId;
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  stripeSessionId: string;
}

const orderSchema = new Schema<OrderDocument>({
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
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  stripeSessionId: {
    type: String,
    required: true,
    unique: true,
  },
});

const Order = model<OrderDocument>("Order", orderSchema);

export default Order;
