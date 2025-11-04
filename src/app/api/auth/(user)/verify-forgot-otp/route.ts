import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { identifier, otp } = await request.json();

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: "Email or Mobile Number is Required !" },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { success: false, message: "OTP is Required !" },
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

    if (!user.otp) {
      return NextResponse.json(
        { success: false, message: "No OTP Found - Please Request Again !" },
        { status: 400 }
      );
    }

    if (user.otp.toString() !== otp.toString()) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP !" },
        { status: 400 }
      );
    }

    if (user.otpExpiry && user.otpExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: "OTP Expired - Please Request a New One !" },
        { status: 400 }
      );
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: "OTP Verified Successfully !" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error Verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error while Verifying OTP !" },
      { status: 500 }
    );
  }
}
