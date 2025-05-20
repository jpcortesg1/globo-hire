import { sessionController } from "@/lib/GameSession/singletons";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await sessionController.createSession();

    // Set the session ID in the cookie using NextResponse
    const response = NextResponse.json({
      success: true,
      session,
    }, { status: 201 });

    response.cookies.set("slot-machine-session", session.id, {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      // secure: process.env.NODE_ENV === "production", // Uncomment in prod
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { success: false, error: "Error creating game session" },
      { status: 500 }
    );
  }
} 