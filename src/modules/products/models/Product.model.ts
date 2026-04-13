import { Schema, model } from "mongoose";

export interface ProductImage {
  public_id: string;
  url: string;
}

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  image: ProductImage;
  category: string;
  isFeatured: boolean;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: {
        public_id: String,
        url: String,
      },
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = model<ProductDocument>("Product", productSchema);

export default Product;
