import mongoose, { Schema, Document } from "mongoose";

interface OrderItem {
  trophyId: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface Order extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  items: OrderItem[];
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  msg?: string;
  totalAmount: number;
  status: string;
  email: string;
  primaryNumber?: string;
  alternateNumber?: string | null;
  deliveryDate?: string;
  otp?: string
}

const OrderSchema: Schema<Order> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        trophyId: { type: Schema.Types.ObjectId, ref: "Trophy", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: "India" },
    },
    msg: {
      type: String
    },
    otp: {
      type: String
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    email: { type: String, required: true },
    primaryNumber: { type: String },
    alternateNumber: { type: String },
    deliveryDate: {
      type: String,
      default: () => {
        const date = new Date();
        date.setDate(date.getDate() + 5);
        return date.toISOString().split("T")[0];
      },
    },
  },
  { timestamps: true }
);

export const OrderModel =
  (mongoose.models.Order as mongoose.Model<Order>) ||
  mongoose.model<Order>("Order", OrderSchema);
