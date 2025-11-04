import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { TrophyModel } from "@/model/Trophy.model";

interface Params {
  id: string;
}

export async function GET(
  req: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Trophy ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const trophy = await TrophyModel.findById(id);

    if (!trophy) {
      return NextResponse.json(
        { success: false, message: "Trophy not found" },
        { status: 404 }
      );
    }

    // Fetch related trophies (same category, excluding current)
    const relatedTrophies = await TrophyModel.find({
      category: trophy.category,
      _id: { $ne: trophy._id },
    })
      .limit(4)
      .select("name price image discription category");

    return NextResponse.json(
      {
        success: true,
        data: {
          trophy,
          related: relatedTrophies,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error while fetching trophy",
      },
      { status: 500 }
    );
  }
}
