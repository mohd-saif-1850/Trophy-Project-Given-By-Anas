import { NextResponse } from "next/server";
import { TrophyModel } from "@/model/Trophy.model";
import dbConnect from "@/lib/dbConnect";
import { deleteFromCloudinary } from "@/helper/cloudinary";

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Trophy ID is required!");

    const trophy = await TrophyModel.findById(id);
    if (!trophy) throw new Error("Trophy not found!");

    if (trophy.image && trophy.image.includes("cloudinary")) {
      const publicId = trophy.image.split("/").pop()?.split(".")[0];
      if (publicId) await deleteFromCloudinary(publicId);
    }

    await TrophyModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Trophy deleted successfully!" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to delete trophy!" }, { status: 500 });
  }
}
