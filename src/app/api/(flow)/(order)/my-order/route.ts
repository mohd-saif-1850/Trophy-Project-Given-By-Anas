import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { OrderModel } from "@/model/Order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const orders = await OrderModel.find({
      email: session.user.email,
    })
      .populate("items.trophyId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err: any) {
    console.error("Fetch orders error:", err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
