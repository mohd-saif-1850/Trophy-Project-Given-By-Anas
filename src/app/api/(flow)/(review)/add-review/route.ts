import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ReviewModel } from "@/model/Review.model";
import { TrophyModel } from "@/model/Trophy.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { rating, comment, trophyId } = body;

    if (!rating || !trophyId) {
      return NextResponse.json(
        { success: false, message: "Rating and Trophy ID are required" },
        { status: 400 }
      );
    }

    const userId = session.user._id;

    const review = await ReviewModel.create({
      userId,
      rating,
      comment,
      trophyId,
    });

    return NextResponse.json(
      { success: true, message: "Review added", review },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 }
    );
  }
}
