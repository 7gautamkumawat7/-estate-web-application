import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { updateEnquiryStatusSchema } from "@/lib/validations/enquiry";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSessionAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    id: string;
  };
}

// GET /api/enquiries/[id] - Admin-only single enquiry view
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return apiError("Unauthorized: Admin authentication required", 401);
    }

    const { id } = params;
    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            area: true,
            price: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!enquiry) {
      return apiError("Enquiry not found", 404);
    }

    return apiSuccess(enquiry);
  } catch (error) {
    console.error(`GET /api/enquiries/${params?.id} error:`, error);
    return apiError("Internal server error fetching enquiry details", 500);
  }
}

// PATCH /api/enquiries/[id] - Admin-only update enquiry status
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return apiError("Unauthorized: Admin authentication required", 401);
    }

    const { id } = params;
    const body = await req.json().catch(() => null);
    if (!body) {
      return apiError("Missing JSON body", 400);
    }

    const parseResult = updateEnquiryStatusSchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Invalid status value", 422, parseResult.error.flatten());
    }

    const { status } = parseResult.data;

    const existing = await prisma.enquiry.findUnique({ where: { id } });
    if (!existing) {
      return apiError("Enquiry not found", 404);
    }

    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return apiSuccess(updated);
  } catch (error) {
    console.error(`PATCH /api/enquiries/${params?.id} error:`, error);
    return apiError("Internal server error updating enquiry", 500);
  }
}
