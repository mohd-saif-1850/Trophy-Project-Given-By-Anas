import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../[...nextauth]/option";

export async function DELETE( request : Request){
  try {
    await dbConnect()

    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized — Please Sign in First !" },
        { status: 401 }
      );
    }

    const deleteUser = await UserModel.findOneAndDelete({
      $or : [
        {_id : session?.user._id},
        {email : session?.user.email},
        {mobileNumber : session?.user.mobileNumber}
      ]
    })

    if (!deleteUser) {
      return NextResponse.json({
        success : false,
        message : "User not Found for Deletion !"
      },{ status : 404})
    }

    return NextResponse.json({
      success : true,
      message : "User Deleted Successfully !"
    },{ status : 200 })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal Server Error while Deleting the User !" },
      { status: 500 }
    );
  }
}