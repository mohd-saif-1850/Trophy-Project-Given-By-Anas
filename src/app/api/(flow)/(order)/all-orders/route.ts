import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { OrderModel } from "@/model/Order.model";

export async function GET() {
  try {
    await dbConnect();

    const orders = await OrderModel.find()
      .populate("items.trophyId", "name image price")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, orders },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Admin Get Orders Error:", err);
    const isProd = process.env.NODE_ENV === "production";

    return NextResponse.json(
      {
        success: false,
        message: err?.message || "Failed to fetch orders",
        stack: isProd ? undefined : err?.stack,
      },
      { status: 500 }
    );
  }
}
