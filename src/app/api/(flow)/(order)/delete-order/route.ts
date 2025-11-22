import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { OrderModel } from "@/model/Order.model";
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

    if (!id) throw new Error("Order ID is required!");

    const order = await OrderModel.findById(id);
    if (!order) throw new Error("Order not found!");

    // Check if the order belongs to the logged-in user
    if (order.email !== session.user.email) {
      throw new Error("You are not allowed to cancel this order!");
    }

    // Only allow delete/cancel if pending
    if (order.status.toLowerCase() !== "pending") {
      throw new Error("Only pending orders can be cancelled!");
    }

    // Cancel order
    order.status = "Cancelled";
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
