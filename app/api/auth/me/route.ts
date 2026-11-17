import { getSessionAdmin } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return apiError("Unauthenticated", 401);
    }

    return apiSuccess({
      admin,
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return apiError("Internal server error", 500);
  }
}
