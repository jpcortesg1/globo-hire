import { sessionController } from "@/lib/GameSession/singletons";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("slot-machine-session")?.value;
    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    const result = await sessionController.getStatus(sessionId);

    return NextResponse.json({
      success: true,
      status: result.session.toJSON(),
      message: result.message,
    });
  } catch (error) {
    console.error("Error retrieving session status:", error);
    if (error instanceof Error && error.message === "Session not found") {
      return NextResponse.json({
        success: false,
        error: "Session is not valid."
      }, { status: 401 });
    }
    return NextResponse.json({
      success: false,
      error: "Error retrieving session status."
    }, { status: 500 });
  }
} 