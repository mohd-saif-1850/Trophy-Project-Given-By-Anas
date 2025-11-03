import { NextResponse } from "next/server";
import { TrophyModel } from "@/model/Trophy.model";
import dbConnect from "@/lib/dbConnect";
import { uploadToCloudinary } from "@/helper/cloudinary";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const image = formData.get("image") as File | null;

    if (!name) {
      throw new Error("Trophy Name is Required !");
    }

    if (!price) {
      throw new Error("Trophy Price is Required !");
    }

    if (!image) {
      throw new Error("Trophy Image is Required !");
    }

    const existingTrophy = await TrophyModel.findOne({ name });

    if (existingTrophy) {
      return NextResponse.json(
        { success: false, message: "Trophy Already Exists with the Same Name !" },
        { status: 400 }
      );
    }

    const upload = await uploadToCloudinary(image, "trophies");

    if (!upload.success) {
      throw new Error("Image Upload Failed !");
    }

    const newTrophy = new TrophyModel({
      name,
      price,
      category,
      image: upload.url,
    });

    await newTrophy.save();

    return NextResponse.json(
      { success: true, message: "Trophy Created Successfully !", data: newTrophy },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error while Creating the Trophy !",
      },
      { status: 500 }
    );
  }
}
