import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AUTH_COOKIE_NAME, signToken, verifyPassword } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { apiError, apiSuccess } from "@/lib/api/response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "admin-client";
    const rateCheck = checkRateLimit(`login-${ip}`, 5, 900000); // 5 attempts per 15 min
    if (!rateCheck.allowed) {
      return apiError(
        "Too many login attempts. Please wait 15 minutes before trying again.",
        429
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return apiError("Missing credentials payload", 400);
    }

    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid credentials provided", 400);
    }

    const { email, password } = parseResult.data;

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      // Intentionally generic error message to prevent enumeration
      return apiError("Invalid email or password", 401);
    }

    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      return apiError("Invalid email or password", 401);
    }

    // Sign JWT
    const token = await signToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const response = apiSuccess({
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });

    // Set secure HttpOnly cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return apiError("Internal server error during authentication", 500);
  }
}
