import { getSessionAdmin } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api/response";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return apiError("Unauthorized: Admin authentication required", 401);
    }

    const [
      totalProperties,
      readyProperties,
      offPlanProperties,
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      closedEnquiries,
      distinctAreas,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: "READY" } }),
      prisma.property.count({ where: { status: "OFF_PLAN" } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.enquiry.count({ where: { status: "CONTACTED" } }),
      prisma.enquiry.count({ where: { status: "CLOSED" } }),
      prisma.property.findMany({
        select: { area: true },
        distinct: ["area"],
      }),
    ]);

    return apiSuccess({
      totalProperties,
      readyProperties,
      offPlanProperties,
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      closedEnquiries,
      communitiesCount: distinctAreas.length,
      communities: distinctAreas.map((a) => a.area),
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return apiError("Internal server error fetching admin statistics", 500);
  }
}
