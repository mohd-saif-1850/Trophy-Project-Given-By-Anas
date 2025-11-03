import { NextResponse } from "next/server";
import { UserModel } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email, otp } = await request.json();

    if (!email) {
      throw new Error("Email is required!");
    }

    if (!otp) {
      throw new Error("OTP is required!");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: "OTP has expired! Please request a new one." },
        { status: 400 }
      );
    }

    if (user.otp !== parseInt(otp)) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP!" },
        { status: 400 }
      );
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Email verified successfully!" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error verifying user:", error.message);
    return NextResponse.json(
      { success: false, message: "Internal server error while verifying user!" },
      { status: 500 }
    );
  }
}
