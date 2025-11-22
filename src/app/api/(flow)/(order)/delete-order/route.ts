import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FeedbackModel } from "@/model/Feedback.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      throw new Error("Unauthorized");
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Feedback ID is required!");

    const feedback = await FeedbackModel.findById(id);
    if (!feedback) throw new Error("Feedback not found!");

    if (feedback.email !== session.user.email) {
      throw new Error("You are not allowed to delete this feedback!");
    }

    await FeedbackModel.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Feedback deleted successfully!" },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete feedback!" },
      { status: 500 }
    );
  }
}
