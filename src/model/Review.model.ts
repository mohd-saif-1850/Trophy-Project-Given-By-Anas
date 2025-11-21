import mongoose, { Schema, Document } from "mongoose";

export interface Review extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  rating: number;
  comment?: string;
  trophyId?: mongoose.Schema.Types.ObjectId;
}

const ReviewSchema: Schema<Review> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: "No Comment Added !",
      trim: true,
    },

    trophyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trophy",
    },
  },
  { timestamps: true }
);

export const ReviewModel =
  (mongoose.models.Review as mongoose.Model<Review>) ||
  mongoose.model<Review>("Review", ReviewSchema);
