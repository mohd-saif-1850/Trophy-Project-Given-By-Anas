import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ReviewModel } from "@/model/Review.model";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Trophy ID is required");

    const reviews = await ReviewModel.find({ trophyId: id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, reviews }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
