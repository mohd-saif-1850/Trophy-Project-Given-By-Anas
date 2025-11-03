import { NextResponse } from "next/server";
import { TrophyModel } from "@/model/Trophy.model";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    const trophies = await TrophyModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: trophies }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to fetch trophies!" }, { status: 500 });
  }
}
