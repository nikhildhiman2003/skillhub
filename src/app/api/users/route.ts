import { NextRequest, NextResponse } from "next/server";

import { createUserSchema } from "@/schemas/user.schema";
import { createUser, getUser } from "@/services/user.service";

export async function GET() {
  try {
    const users = await getUser();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET_USERS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
} 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = createUserSchema.safeParse(body);

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

    const user = await createUser(result.data);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 }
      );
    }

    console.error("CREATE_USER_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
      },
      { status: 500 }
    );
  }
}