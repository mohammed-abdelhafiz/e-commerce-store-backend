import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface UserDocument extends Document {
  // fields
  name: string;
  email: string;
  password: string;
  cart: {
    product: mongoose.Schema.Types.ObjectId;
    quantity: number;
  }[];
  role: string;
  // methods
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 6,
    },
    cart: [
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
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.toJSON = function () {
  const { password, __v, ...rest } = this.toObject();
  return rest;
};

userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
