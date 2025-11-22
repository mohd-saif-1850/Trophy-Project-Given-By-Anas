import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { FeedbackModel } from "@/model/Feedback.model";
import { UserModel } from "@/model/User.model";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, comment, rating } = body;

    const user = await UserModel.findOne({ email: session.user.email });

    const feedback = await FeedbackModel.create({
      userId: session.user._id,
      name,
      email,
      comment,
      rating: rating || null,
      status: "pending",
    });

    return NextResponse.json(
      { success: true, message: "Feedback submitted", feedback },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
