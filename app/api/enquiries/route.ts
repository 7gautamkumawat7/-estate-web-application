import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { enquirySchema } from "@/lib/validations/enquiry";
import { apiError, apiSuccess } from "@/lib/api/response";
import { getSessionAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// POST /api/enquiries - Public enquiry submission
export async function POST(req: NextRequest) {
  try {
    // 1. IP rate limiting (5 requests per 3 minutes)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous-client";
    const rateCheck = checkRateLimit(`enquiry-${ip}`, 5, 180000);
    if (!rateCheck.allowed) {
      return apiError(
        "Too many enquiry requests. Please wait a moment before submitting again.",
        429
      );
    }

    // 2. Validate request body
    const body = await req.json().catch(() => null);
    if (!body) {
      return apiError("Missing or malformed JSON body", 400);
    }

    const parseResult = enquirySchema.safeParse(body);
    if (!parseResult.success) {
      return apiError("Validation failed", 422, parseResult.error.flatten());
    }

    const { name, email, phone, message, propertyId } = parseResult.data;

    // 3. Verify property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { id: true, title: true },
    });

    if (!property) {
      return apiError("Referenced property does not exist", 404);
    }

    // 4. Save enquiry
    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        phone,
        message,
        propertyId,
        status: "NEW",
      },
    });

    return apiSuccess(
      {
        id: enquiry.id,
        message: "Enquiry submitted successfully. A NovaEstate specialist will contact you shortly.",
      },
      undefined,
      201
    );
  } catch (error) {
    console.error("POST /api/enquiries error:", error);
    return apiError("Internal server error processing enquiry", 500);
  }
}

// GET /api/enquiries - Admin-only enquiry listing with filters and pagination
export async function GET(req: NextRequest) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return apiError("Unauthorized: Admin authentication required", 401);
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const propertyId = searchParams.get("propertyId")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(searchParams.get("limit") || "10", 10) || 10));

    const where: Prisma.EnquiryWhereInput = {};

    if (status && status !== "ALL") {
      where.status = { equals: status };
    }

    if (propertyId && propertyId !== "ALL") {
      where.propertyId = { equals: propertyId };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const total = await prisma.enquiry.count({ where });
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            slug: true,
            area: true,
            price: true,
          },
        },
      },
    });

    return apiSuccess(enquiries, {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("GET /api/enquiries error:", error);
    return apiError("Internal server error fetching enquiries", 500);
  }
}
