import { Document, Schema, Types, model } from "mongoose";

interface CouponDocument extends Document {
    code: string;
    discountPercentage: number;
    expiresAt: Date;
    isActive: boolean;
    user: Types.ObjectId;
}

const couponSchema = new Schema<CouponDocument>({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    
}, { timestamps: true });

const Coupon = model<CouponDocument>("Coupon", couponSchema);

export default Coupon;