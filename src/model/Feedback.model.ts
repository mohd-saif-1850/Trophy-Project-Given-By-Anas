import mongoose, { Schema, Document } from "mongoose";

export interface Feedback extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  comment: string;
  rating?: number;
  reply?: string;
  status: "pending" | "approved";
}

const FeedbackSchema: Schema<Feedback> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    comment: {
      type: String,
      default: "No Comment Added !",
      trim: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    reply: {
      type: String,
      default: "No Reply Yet !",
    },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const FeedbackModel =
  (mongoose.models.Feedback as mongoose.Model<Feedback>) ||
  mongoose.model<Feedback>("Feedback", FeedbackSchema);
