import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { OrderModel } from "@/model/Order.model";

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Order ID is required!");

    const order = await OrderModel.findById(id);
    if (!order) throw new Error("Order not found!");

    if (order.status.toLowerCase() !== "pending") {
      throw new Error("Only pending orders can be cancelled!");
    }

    order.status = "cancelled";
    await order.save();

    return NextResponse.json(
      { success: true, message: "Order cancelled successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to cancel order!" },
      { status: 500 }
    );
  }
}
