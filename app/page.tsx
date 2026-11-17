import React, { Suspense } from "react";
import prisma from "@/lib/prisma";
import HeroParallax from "@/components/home/HeroParallax";
import StatsBar from "@/components/home/StatsBar";
import PropertyFilters from "@/components/home/PropertyFilters";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyModel3D from "@/components/properties/PropertyModel3D";
import { PropertyGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import {
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  Award,
  Globe2,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: {
    search?: string;
    area?: string;
    type?: string;
    bedrooms?: string;
    minPrice?: string;
    maxPrice?: string;
    status?: string;
    sort?: string;
    page?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const {
    search,
    area,
    type,
    bedrooms: bedroomsParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    status,
    sort = "newest",
    page: pageParam = "1",
  } = searchParams;

  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const limit = 9;

  // Build Prisma Where Clause
  const where: Prisma.PropertyWhereInput = {};

  if (search && search.trim() !== "") {
    const q = search.trim();
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { area: { contains: q } },
    ];
  }

  if (area && area !== "All" && area.trim() !== "") {
    where.area = { equals: area };
  }

  if (type && type !== "All" && type.trim() !== "") {
    where.type = { equals: type };
  }

  const bedrooms = bedroomsParam ? parseInt(bedroomsParam, 10) : undefined;
  if (bedrooms !== undefined && !isNaN(bedrooms)) {
    if (bedrooms >= 5) {
      where.bedrooms = { gte: 5 };
    } else {
      where.bedrooms = { equals: bedrooms };
    }
  }

  const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
  const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined && !isNaN(minPrice)) where.price.gte = minPrice;
    if (maxPrice !== undefined && !isNaN(maxPrice)) where.price.lte = maxPrice;
  }

  if (status && (status === "READY" || status === "OFF_PLAN")) {
    where.status = { equals: status };
  }

  // Order By
  let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price-desc") {
    orderBy = { price: "desc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  // Fetch data in parallel
  const [
    totalProperties,
    readyProperties,
    offPlanProperties,
    distinctAreas,
    filteredTotal,
    properties,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "READY" } }),
    prisma.property.count({ where: { status: "OFF_PLAN" } }),
    prisma.property.findMany({ select: { area: true }, distinct: ["area"] }),
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  const totalPages = Math.ceil(filteredTotal / limit) || 1;

  // Build pagination URL helper
  const createPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val && key !== "page") params.set(key, val);
    });
    params.set("page", targetPage.toString());
    return `/?${params.toString()}#listings`;
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {/* 1. Hero Section with 3D Parallax */}
      <HeroParallax />

      {/* 2. Stats Bar with Live Database Metrics */}
      <StatsBar
        stats={{
          totalProperties,
          readyProperties,
          offPlanProperties,
          communitiesCount: distinctAreas.length,
        }}
      />

      {/* 3. Main Listings & Discovery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-borderBase-dark">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Featured Dubai Residences
            </h2>
          </div>
          <div className="text-xs text-gray-400 font-mono mt-2 md:mt-0">
            Displaying <span className="text-gold font-bold">{properties.length}</span> of{" "}
            <span className="text-white font-bold">{filteredTotal}</span> available properties
          </div>
        </div>

        {/* Filters Suite (with URL Synchronization) */}
        <Suspense fallback={<div className="h-24 bg-navy-800 rounded-xl animate-pulse mb-8" />}>
          <PropertyFilters />
        </Suspense>

        {/* Property Grid or Empty State */}
        {properties.length === 0 ? (
          <div className="bg-navy-800/60 border border-borderBase-dark rounded-2xl p-12 text-center max-w-xl mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-navy-700/80 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
              <Building className="w-8 h-8 opacity-70" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">
              No Residences Match Your Criteria
            </h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              We couldn&apos;t find any properties matching the current filter parameters. Try expanding your price range, choosing all communities, or clearing active filters.
            </p>
            <Link
              href="/#listings"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold text-navy-900 text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-all shadow-gold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            <Link
              href={createPageUrl(Math.max(1, page - 1))}
              className={`p-2.5 rounded-lg border border-borderBase-dark bg-navy-800 text-gray-300 hover:text-white hover:border-gold/50 transition-colors ${
                page <= 1 ? "opacity-30 pointer-events-none" : ""
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pNum = idx + 1;
              const isCurrent = pNum === page;
              return (
                <Link
                  key={pNum}
                  href={createPageUrl(pNum)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-semibold transition-all ${
                    isCurrent
                      ? "bg-gold text-navy-900 font-bold shadow-gold scale-105"
                      : "bg-navy-800 text-gray-300 border border-borderBase-dark hover:border-gold/40 hover:text-white"
                  }`}
                >
                  {pNum}
                </Link>
              );
            })}

            <Link
              href={createPageUrl(Math.min(totalPages, page + 1))}
              className={`p-2.5 rounded-lg border border-borderBase-dark bg-navy-800 text-gray-300 hover:text-white hover:border-gold/50 transition-colors ${
                page >= totalPages ? "opacity-30 pointer-events-none" : ""
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </section>

      {/* 4. Interactive 3D Architectural Showcase */}
      <section className="bg-navy-800/40 border-y border-borderBase-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-xs font-mono text-gold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Spatial Innovation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
                Architectural <br />
                Mastery in 3D
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Every residence curated by NovaEstate represents the pinnacle of modern architectural expression. Experience cantilevered sky terraces, double-height ceiling voids, and bioclimatic energy efficiency engineered for the Dubai climate.
              </p>
              <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-lg bg-navy-900 border border-borderBase-dark">
                  <div className="text-gold font-mono font-bold text-sm">360° Vistas</div>
                  <div className="text-gray-400 mt-0.5">Gulf & Skyline Panoramas</div>
                </div>
                <div className="p-3.5 rounded-lg bg-navy-900 border border-borderBase-dark">
                  <div className="text-gold font-mono font-bold text-sm">Private Pools</div>
                  <div className="text-gray-400 mt-0.5">Terrace Zero-Edge Spas</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <PropertyModel3D />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Brand Heritage & Trust Section */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-gold">
            The NovaEstate Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2 mb-4">
            Bespoke Advisory for Prime Dubai Living
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Representing discerning international investors and homeowners seeking trophy assets across the United Arab Emirates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="luxury-glass p-8 rounded-2xl border border-borderBase-dark hover:border-gold/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              Uncompromising Discretion
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              We manage off-market pocket listings and ultra-prime transactions with institutional-grade privacy protocols.
            </p>
          </div>

          <div className="luxury-glass p-8 rounded-2xl border border-borderBase-dark hover:border-gold/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-5">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              Global Investor Access
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Seamless cross-border transaction assistance, UAE Golden Visa processing, and institutional escrow compliance.
            </p>
          </div>

          <div className="luxury-glass p-8 rounded-2xl border border-borderBase-dark hover:border-gold/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center mb-5">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-white mb-2">
              Developer Tier-One Allocations
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              First-look access to launch phases in Palm Jumeirah, Downtown Dubai, and Dubai Hills Estate before public release.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
