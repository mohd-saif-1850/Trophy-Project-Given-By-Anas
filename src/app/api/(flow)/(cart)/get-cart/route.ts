import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in first!" },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({ email: session.user?.email }).populate("cart.trophyId");
    if (!user) {
      throw new Error("User not found!");
    }

    return NextResponse.json(
      { success: true, data: user.cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Error fetching cart!" },
      { status: 500 }
    );
  }
}
