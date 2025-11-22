import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ReviewModel } from "@/model/Review.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can access this" },
        { status: 401 }
      );
    }

    const reviews = await ReviewModel.find()
      .populate("userId", "name email")
      .populate("trophyId", "name price")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
