import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { sendForgotPasswordEmail } from "@/helper/sendForgotPasswordEmail";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { identifier } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: "Email or Mobile Number is required!" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { mobileNumber: identifier }],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No user found with this email or mobile number!",
        },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendForgotPasswordEmail(user.email, user.name, otp.toString());

    return NextResponse.json(
      { success: true, message: "OTP sent to your email successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error while sending OTP!",
      },
      { status: 500 }
    );
  }
}
