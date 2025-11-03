import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/option";

export async function PATCH(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized — Please sign in first!" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, mobileNumber } = body;

    if (!name && !mobileNumber) {
      return NextResponse.json(
        { success: false, message: "Please provide at least one field (name or mobileNumber) to update." },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      { $set: { ...(name && { name }), ...(mobileNumber && { mobileNumber }) } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found for update!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User updated successfully!", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error while updating the user!" },
      { status: 500 }
    );
  }
}
