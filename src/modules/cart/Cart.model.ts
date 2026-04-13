import mongoose from "mongoose";
import type { Document } from "mongoose";

interface CartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface CartDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: CartItem[];
}

const cartSchema = new mongoose.Schema<CartDocument>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

const Cart = mongoose.model<CartDocument>("Cart", cartSchema);

export default Cart;
