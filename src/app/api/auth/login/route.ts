import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/schemas/auth.schema";
import { loginUser } from "@/services/auth.service";
import { createAccessToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await loginUser(result.data);

    const token = await createAccessToken({
      id: user.id,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user,
    });

    response.cookies.set({
      name: "skillhub_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
