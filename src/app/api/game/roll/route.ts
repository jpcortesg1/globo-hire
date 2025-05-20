import { gameController } from "@/lib/GameSession/singletons";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("slot-machine-session")?.value;
    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const result = await gameController.roll(sessionId);
    return NextResponse.json({ result, success: true });
  } catch (error) {
    console.error("Error processing roll:", error);
    if (error instanceof Error) {
      if (error.message === "Insufficient credits") {
        return NextResponse.json({
          success: false,
          error: "You do not have enough credits to play."
        }, { status: 400 });
      } else if (error.message === "Session not found" || error.message === "Session is not active") {
        return NextResponse.json({
          success: false,
          error: "Session is not valid."
        }, { status: 401 });
      }
    }
    return NextResponse.json({
      success: false,
      error: "Error processing roll."
    }, { status: 500 });
  }
} 