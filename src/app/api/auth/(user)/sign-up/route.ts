import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserModel } from "@/model/User.model";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, mobileNumber, email, password } = await request.json()

    if (!name) {
      throw new Error("Name is Required !");
    }

    if (!mobileNumber) {
      throw new Error("Mobile Number is Required !");
    }

    if (!email) {
      throw new Error("Email is Required !");
    }

    if (!password) {
      throw new Error("Password is Required !");
    }

    const existingUser = await UserModel.findOne({ 
      $or : [
        {email},
        {mobileNumber}
      ]
     });

    if (existingUser) {
      return NextResponse.json(
        { success: false,
          message: "User Already Exists with the Same Mobile Number or Email !" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    
    const newUser = new UserModel({
      name,
      mobileNumber,
      email,
      password: hashedPassword,
      verified: false,
      otp,
      otpExpiry,
      expiresAt,
    });

    await newUser.save();
    await sendVerificationEmail(email, name, otp.toString());

    return NextResponse.json(
      { success: true,
        message: "User Created Successfully - Please Verify Your Email !" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error while Registering the User !" },
      { status: 500 }
    );
  }
}