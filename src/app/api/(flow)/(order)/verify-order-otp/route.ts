import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { OrderModel } from "@/model/Order.model";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Order ID is required!");

    const body = await request.json();
    const { otp } = body;

    if (!otp) throw new Error("OTP is required!");

    const order = await OrderModel.findById(id);
    if (!order) throw new Error("Order not found!");

    if (!order.otp)
      return NextResponse.json(
        { success: false, message: "No OTP generated for this order" },
        { status: 400 }
      );

    if (order.otp !== otp)
      return NextResponse.json(
        { success: false, message: "Incorrect OTP" },
        { status: 400 }
      );

    order.status = "Completed";
    order.otp = undefined;
    await order.save();

    return NextResponse.json(
      { success: true, message: "OTP verified successfully", order },
      { status: 200 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
