import { NextResponse } from "next/server";
import { TrophyModel } from "@/model/Trophy.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Trophy ID is required!");

    const trophy = await TrophyModel.findById(id);
    if (!trophy) throw new Error("Trophy not found!");

    return NextResponse.json({ success: true, data: trophy }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to fetch trophy!" }, { status: 500 });
  }
}
