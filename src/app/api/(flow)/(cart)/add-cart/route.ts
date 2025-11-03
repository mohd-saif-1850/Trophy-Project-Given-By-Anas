import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in first!" },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({ email: session.user?.email });
    if (!user) {
      throw new Error("User not found!");
    }

    const { trophyId, quantity } = await request.json();

    if (!trophyId) {
      throw new Error("Trophy ID is required!");
    }

    const existingItem = user.cart.find(
      (item: any) => item.trophyId.toString() === trophyId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ trophyId, quantity: quantity || 1 });
    }

    await user.save();

    return NextResponse.json(
      { success: true, message: "Item added to cart!", data: user.cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Error adding to cart!" },
      { status: 500 }
    );
  }
}
