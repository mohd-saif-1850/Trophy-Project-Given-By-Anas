import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { TrophyModel } from "@/model/Trophy.model"; // ← IMPORTANT

export async function DELETE(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) throw new Error("Trophy ID is required!");

    const trophy = await TrophyModel.findById(id);
    if (!trophy) throw new Error("Trophy not found!");

    await TrophyModel.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Trophy deleted successfully!" },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete trophy!" },
      { status: 500 }
    );
  }
}
