import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { identifier, newPassword } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: "Email or Mobile Number is Required !" },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password Must be at least 6 Characters !" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "No User Found with this Email or Mobile Number !" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { success: true, message: "Password Changed Successfully !" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Changing Password:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error while Changing Password !" },
      { status: 500 }
    );
  }
}
