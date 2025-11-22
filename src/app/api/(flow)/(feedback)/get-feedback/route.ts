import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FeedbackModel } from "@/model/Feedback.model";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId)
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );

    const feedbacks = await FeedbackModel.find({ userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, feedbacks });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
