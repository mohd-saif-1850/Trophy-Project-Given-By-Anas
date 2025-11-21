import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { OrderModel } from "@/model/Order.model";
import { UserModel } from "@/model/User.model";
import { sendOrderOtpEmail } from "@/helper/sendOrderOtp";
import { sendOrderCancelledEmail } from "@/helper/sendOrderCancelled";

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("Order ID is required!");

    const body = await request.json();
    const { status, msg } = body;
    if (!status) throw new Error("Status is required!");

    const order = await OrderModel.findById(id);
    if (!order) throw new Error("Order not found!");

    let updateData: any = { status };

    const user = await UserModel.findOne({ email: order.email });

    if (status.toLowerCase() === "cancelled") {
      const finalMsg = typeof msg === "string" && msg.trim() ? msg.trim() : order.msg || "";
      updateData.msg = finalMsg;
      if (user) {
        try {
          await sendOrderCancelledEmail(order.email, user.name || "Customer", finalMsg, String(order._id));
        } catch (e) {
          console.error("Failed sending cancelled email:", e);
        }
      }
    }

    if (status.toLowerCase() === "completed") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      updateData.otp = otp;
      if (user) {
        try {
          await sendOrderOtpEmail(order.email, user.name || "Customer", otp, String(order._id));
        } catch (e) {
          console.error("Failed sending OTP email:", e);
        }
      }
    }

    const updated = await OrderModel.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, order: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to update order status" }, { status: 500 });
  }
}
