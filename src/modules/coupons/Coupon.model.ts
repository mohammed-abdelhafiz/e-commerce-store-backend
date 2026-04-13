import { Schema, model } from "mongoose";

const couponSchema = new Schema({
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
    used: {
        type: Boolean,
        default: false,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    
}, { timestamps: true });

const Coupon = model("Coupon", couponSchema);

export default Coupon;