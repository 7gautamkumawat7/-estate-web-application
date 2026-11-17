import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";

export const dynamic = "force-dynamic";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;

    if (!slug) {
      return apiError("Property slug is required", 400);
    }

    const property = await prisma.property.findUnique({
      where: { slug },
    });

    if (!property) {
      return apiError("Property not found", 404);
    }

    let imagesArray: string[] = [];
    let featuresArray: string[] = [];
    try {
      imagesArray = JSON.parse(property.images);
    } catch {
      imagesArray = [property.imageUrl];
    }
    try {
      featuresArray = JSON.parse(property.features);
    } catch {
      featuresArray = [];
    }

    return apiSuccess({
      ...property,
      images: imagesArray,
      features: featuresArray,
    });
  } catch (error) {
    console.error(`GET /api/properties/${params?.slug} error:`, error);
    return apiError("Internal server error fetching property details", 500);
  }
}
