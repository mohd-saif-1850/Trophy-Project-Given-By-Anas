import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { OrderModel } from "@/model/Order.model";
import { UserModel } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import mongoose from "mongoose";
import { sendOrderConfirmationEmail } from "@/helper/sendOrderEmail";

function isValidString(v: any) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

    const body = await req.json();
    const { items, totalAmount, address, alternateNumber } = body ?? {};

    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ success: false, message: "Items must be a non-empty array" }, { status: 400 });

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it || !isValidString(it.trophyId)) return NextResponse.json({ success: false, message: `items[${i}].trophyId is required` }, { status: 400 });
      if (typeof it.quantity !== "number" || it.quantity <= 0) return NextResponse.json({ success: false, message: `items[${i}].quantity must be >0` }, { status: 400 });
      if (typeof it.price !== "number" || it.price < 0) return NextResponse.json({ success: false, message: `items[${i}].price must be >=0` }, { status: 400 });
    }

    if (typeof totalAmount !== "number" || totalAmount < 0) return NextResponse.json({ success: false, message: "TotalAmount must be >=0" }, { status: 400 });

    const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const orderPayload = {
      userId: user._id as mongoose.Types.ObjectId,
      items: items.map((it: any) => ({
        trophyId: it.trophyId,
        quantity: it.quantity,
        price: it.price,
      })),
      totalAmount,
      address,
      email: user.email,
      primaryNumber: user.mobileNumber || null,
      alternateNumber: alternateNumber || null,
      status: "Pending",
      deliveryDate,
      otp
    };

    const newOrder = await OrderModel.create(orderPayload);

    const populatedOrder = await OrderModel.findById(newOrder._id)
      .populate("items.trophyId")
      .lean();

    await sendOrderConfirmationEmail(user.email, user.name || "Customer", populatedOrder);

    return NextResponse.json({ success: true, message: "Order placed successfully", orderId: newOrder._id }, { status: 201 });

  } catch (err: any) {
    console.error("place-order error:", err);
    return NextResponse.json({ success: false, message: err?.message || "Internal server error" }, { status: 500 });
  }
}
