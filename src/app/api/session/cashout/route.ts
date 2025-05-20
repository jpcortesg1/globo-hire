import { sessionController } from "@/lib/GameSession/singletons";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("slot-machine-session")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 });
    }

    const result = await sessionController.cashOut(sessionId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error processing cash out:", error);
    if (error instanceof Error) {
      if (error.message === "Session not found" || error.message === "Session is not active") {
        return NextResponse.json({
          success: false,
          error: "Session not valid"
        }, { status: 401 });
      }
    }
    return NextResponse.json({
      success: false,
      error: "Error processing cash out"
    }, { status: 500 });
  }
} 