
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. Please log in.",
      },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "You have accessed a protected API.",
    user: {
      id: session.userId,
      role: session.role,
    },
  });
}
