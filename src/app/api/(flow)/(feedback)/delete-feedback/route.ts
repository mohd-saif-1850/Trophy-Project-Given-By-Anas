import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FeedbackModel } from "@/model/Feedback.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Feedback ID required" },
        { status: 400 }
      );
    }

    const feedback = await FeedbackModel.findById(id);
    if (!feedback) {
      return NextResponse.json(
        { success: false, message: "Feedback not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (feedback.userId.toString() !== session.user._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Not allowed to delete this feedback" },
        { status: 403 }
      );
    }

    await FeedbackModel.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Feedback deleted successfully" },
      { status: 200 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
