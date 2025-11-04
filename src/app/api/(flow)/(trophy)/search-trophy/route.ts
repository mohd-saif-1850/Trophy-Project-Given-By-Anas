import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { TrophyModel } from "@/model/Trophy.model";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const query = url.searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Query is required" },
        { status: 400 }
      );
    }

    // Case-insensitive search by name
    const trophies = await TrophyModel.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(10)
      .select("name price image category"); // only return needed fields

    return NextResponse.json({ success: true, trophies }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
