import { NextResponse } from "next/server";
import { TrophyModel } from "@/model/Trophy.model";
import dbConnect from "@/lib/dbConnect";
import { uploadToCloudinary } from "@/helper/cloudinary";

export async function PUT(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const price = formData.get("price") ? Number(formData.get("price")) : undefined;
    const category = formData.get("category") as string;
    const image = formData.get("image") as File | null;

    if (!id) throw new Error("Trophy ID is required!");

    const trophy = await TrophyModel.findById(id);
    if (!trophy) throw new Error("Trophy not found!");

    if (name) trophy.name = name;
    if (price) trophy.price = price;
    if (category) trophy.category = category;

    if (image) {
      const upload = await uploadToCloudinary(image, "trophies");
      if (!upload.success) throw new Error("Image upload failed!");
      trophy.image = upload.url;
    }

    await trophy.save();

    return NextResponse.json({ success: true, message: "Trophy updated successfully!", data: trophy }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to update trophy!" }, { status: 500 });
  }
}
