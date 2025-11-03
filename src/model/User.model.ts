import mongoose, { Schema, Document } from "mongoose";

interface Address {
  label?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CartItem {
  trophyId: mongoose.Schema.Types.ObjectId;
  quantity: number;
}

export interface User extends Document {
  name: string;
  mobileNumber: string;
  email: string;
  password: string;
  verified: boolean;
  otp?: number;
  otpExpiry?: Date;
  role: string;
  cart: CartItem[];
  addresses: Address[];
}

const AddressSchema = new Schema<Address>({
  label: { type: String, default: "Home" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
});

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
    },
    otpExpiry: {
      type: Date,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: [
        {
          trophyId: { type: Schema.Types.ObjectId, ref: "Trophy" },
          quantity: { type: Number, default: 1 },
        },
      ],
    },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
