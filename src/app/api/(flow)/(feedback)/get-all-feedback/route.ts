import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FeedbackModel } from "@/model/Feedback.model";

export async function GET() {
  try {
    await dbConnect();

    const feedbacks = await FeedbackModel.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, feedbacks });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
