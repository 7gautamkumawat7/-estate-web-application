import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { propertyFilterSchema } from "@/lib/validations/property";
import { apiError, apiSuccess } from "@/lib/api/response";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const parseResult = propertyFilterSchema.safeParse(rawParams);
    if (!parseResult.success) {
      return apiError("Invalid query parameters", 400, parseResult.error.flatten());
    }

    const {
      search,
      area,
      type,
      bedrooms,
      minPrice,
      maxPrice,
      status,
      sort,
      page = 1,
      limit = 9,
    } = parseResult.data;

    const where: Prisma.PropertyWhereInput = {};

    // Text search in title, description, or area
    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { area: { contains: q } },
      ];
    }

    // Area filter
    if (area && area !== "All" && area.trim() !== "") {
      where.area = { equals: area };
    }

    // Property type filter
    if (type && type !== "All" && type.trim() !== "") {
      where.type = { equals: type };
    }

    // Bedroom count filter (e.g. 5 means 5+ bedrooms)
    if (bedrooms !== undefined && bedrooms > 0) {
      if (bedrooms >= 5) {
        where.bedrooms = { gte: 5 };
      } else {
        where.bedrooms = { equals: bedrooms };
      }
    }

    // Price range filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Status filter (READY, OFF_PLAN)
    if (status) {
      where.status = { equals: status };
    }

    // Sorting
    let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "price-asc") {
      orderBy = { price: "asc" };
    } else if (sort === "price-desc") {
      orderBy = { price: "desc" };
    } else {
      orderBy = { createdAt: "desc" };
    }

    const total = await prisma.property.count({ where });
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const properties = await prisma.property.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    // Safely parse JSON strings for images and features
    const formattedProperties = properties.map((p) => {
      let imagesArray: string[] = [];
      let featuresArray: string[] = [];
      try {
        imagesArray = JSON.parse(p.images);
      } catch {
        imagesArray = [p.imageUrl];
      }
      try {
        featuresArray = JSON.parse(p.features);
      } catch {
        featuresArray = [];
      }
      return {
        ...p,
        images: imagesArray,
        features: featuresArray,
      };
    });

    return apiSuccess(formattedProperties, {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error) {
    console.error("GET /api/properties error:", error);
    return apiError("Internal server error fetching properties", 500);
  }
}
