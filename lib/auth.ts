import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-novaestate-properties-dev-2026";
const key = new TextEncoder().encode(JWT_SECRET);

export const AUTH_COOKIE_NAME = "nova_admin_token";

export interface AdminPayload {
  adminId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as AdminPayload;
  } catch (err) {
    return null;
  }
}

export async function getSessionAdmin(): Promise<{ id: string; email: string; name: string; role: string } | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.adminId) return null;

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, email: true, name: true, role: true },
    });

    return admin;
  } catch {
    return null;
  }
}
