import { apiSuccess, apiError } from "@/lib/api/response";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      totalProperties,
      readyProperties,
      offPlanProperties,
      distinctAreas,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: "READY" } }),
      prisma.property.count({ where: { status: "OFF_PLAN" } }),
      prisma.property.findMany({
        select: { area: true },
        distinct: ["area"],
      }),
    ]);

    return apiSuccess({
      totalProperties,
      readyProperties,
      offPlanProperties,
      communitiesCount: distinctAreas.length,
      communities: distinctAreas.map((a) => a.area),
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return apiError("Internal server error fetching statistics", 500);
  }
}
