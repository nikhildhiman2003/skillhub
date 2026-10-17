
import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export async function getSession(request: NextRequest) {
  const token = request.cookies.get("skillhub_token")?.value;

  if (!token) {
    return null;
  }

  const session = await verifyAccessToken(token);

  if (!session) {
    return null;
  }

  return session;
}
