import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/option";

export async function GET() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized — Please sign in first!" },
        { status: 401 }
      );
    }

    const user = await UserModel.findOne({ email: session.user.email }).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User fetched successfully!", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error while fetching the user!" },
      { status: 500 }
    );
  }
}
