import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { FeedbackModel } from "@/model/Feedback.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export async function PATCH(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
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

    const body = await request.json();
    const { status } = body;

    if (!["pending", "approved"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const updated = await FeedbackModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status updated",
      feedback: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
