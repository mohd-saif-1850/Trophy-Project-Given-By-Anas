import mongoose, { Schema, Document, models } from "mongoose";

export interface Trophy extends Document {
  name: string;
  price: number;
  category?: string;
  image?: string;
}

const TrophySchema = new Schema<Trophy>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      trim: true,
      default : "None"
    },
    image: {
      type: String,
      default : "https://res.cloudinary.com/ddnxjo72z/image/upload/v1762186666/Gemini_Generated_Image_jwrmrsjwrmrsjwrm_le67jl.png"

    },
  },
  { timestamps: true }
);

export const TrophyModel = models.Trophy || mongoose.model<Trophy>("Trophy", TrophySchema);