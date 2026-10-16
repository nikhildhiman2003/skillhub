import { SignJWT, jwtVerify } from "jose";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not configured");
}

const secretKey = new TextEncoder().encode(secret); //convert the secret to a Uint8Array for use with jose

type UserRole = "CLIENT" | "FREELANCER" | "ADMIN";

export async function createAccessToken(user: {
  id: string;
  role: UserRole;
}) {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt() 
    .setExpirationTime("15m")
    .sign(secretKey);
} 

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    const validRoles: UserRole[] = [
      "CLIENT",
      "FREELANCER",
      "ADMIN",
    ];

    if (
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string" ||
      !validRoles.includes(payload.role as UserRole)
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  } 
}