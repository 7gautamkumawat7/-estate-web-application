import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PropertyGallery from "@/components/properties/PropertyGallery";
import EnquiryForm from "@/components/properties/EnquiryForm";
import PropertyCard from "@/components/properties/PropertyCard";
import { formatAED, formatNumber } from "@/lib/utils";
import Link from "next/link";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  CheckCircle,
  Building,
  Shield,
  ChevronRight,
  Share2,
  Calendar,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PropertyPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
  });

  if (!property) {
    return {
      title: "Property Not Found | NovaEstate Properties",
    };
  }

  return {
    title: `${property.title} | NovaEstate Properties`,
    description: `${property.title} in ${property.area}, Dubai. ${property.bedrooms} Bed, ${property.bathrooms} Bath, ${property.size} sq ft. ${formatAED(property.price)}.`,
    openGraph: {
      title: `${property.title} | ${property.area}, Dubai`,
      description: property.description,
      images: [{ url: property.imageUrl }],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
  });

  if (!property) {
    notFound();
  }

  // Parse images and features safely
  let images: string[] = [];
  let features: string[] = [];

  try {
    images = JSON.parse(property.images);
  } catch {
    images = [property.imageUrl];
  }

  try {
    features = JSON.parse(property.features);
  } catch {
    features = [];
  }

  // Fetch 3 related properties in the same or nearby area
  const relatedProperties = await prisma.property.findMany({
    where: {
      id: { not: property.id },
      area: property.area,
    },
    take: 3,
  });

  // Fallback if less than 3 in same area
  let fallbackProperties = relatedProperties;
  if (relatedProperties.length < 3) {
    const additional = await prisma.property.findMany({
      where: {
        id: { notIn: [property.id, ...relatedProperties.map((p) => p.id)] },
      },
      take: 3 - relatedProperties.length,
    });
    fallbackProperties = [...relatedProperties, ...additional];
  }

  return (
    <div className="min-h-screen bg-navy-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-mono">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/#listings" className="hover:text-gold transition-colors">
            Residences
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={`/?area=${encodeURIComponent(property.area)}#listings`}
            className="hover:text-gold transition-colors"
          >
            {property.area}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-200 truncate max-w-xs">{property.title}</span>
        </nav>

        {/* Property Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-borderBase-dark mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2.5">
              <span
                className={`px-3 py-1 rounded text-xs font-semibold uppercase font-mono tracking-wider ${
                  property.status === "READY"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    : "bg-gold/20 text-gold-light border border-gold/40"
                }`}
              >
                {property.status === "READY" ? "Ready for Handover" : "Prime Off-Plan Launch"}
              </span>

              <span className="px-3 py-1 rounded text-xs font-medium bg-navy-800 text-gray-300 border border-borderBase-dark">
                {property.type}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-gold-light font-medium">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span>{property.area}, Dubai, United Arab Emirates</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              {property.title}
            </h1>
          </div>

          <div className="lg:text-right shrink-0">
            <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">
              Investment Guide Price
            </div>
            <div className="text-3xl sm:text-4xl font-serif font-bold text-gold-gradient">
              {formatAED(property.price)}
            </div>
          </div>
        </div>

        {/* Main Content Grid: Left Gallery & Details, Right Sticky Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (8 cols): Gallery + Property Specs + Description + Features */}
          <div className="lg:col-span-8 space-y-10">
            {/* Image Gallery */}
            <PropertyGallery images={images} title={property.title} />

            {/* Quick Specs Highlight Bar */}
            <div className="luxury-glass p-5 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-borderBase-dark/60">
              <div className="flex items-center gap-3.5 px-2">
                <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-serif font-bold text-white">
                    {property.bedrooms} Bedrooms
                  </div>
                  <div className="text-[11px] text-gray-400">Master Suites</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-3 sm:pt-0 px-2 sm:pl-5">
                <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <Bath className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-serif font-bold text-white">
                    {property.bathrooms} Bathrooms
                  </div>
                  <div className="text-[11px] text-gray-400">Designer En-suites</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-3 sm:pt-0 px-2 sm:pl-5">
                <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <Square className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-serif font-bold text-white">
                    {formatNumber(property.size)} sq ft
                  </div>
                  <div className="text-[11px] text-gray-400">Built-Up Area</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 pt-3 sm:pt-0 px-2 sm:pl-5">
                <div className="w-10 h-10 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-base font-serif font-bold text-white">
                    {property.type}
                  </div>
                  <div className="text-[11px] text-gray-400">Property Class</div>
                </div>
              </div>
            </div>

            {/* Architectural Narrative Description */}
            <div className="bg-navy-800/80 border border-borderBase-dark rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-serif font-bold text-white">
                Architectural Narrative
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Signature Features & Amenities */}
            <div className="bg-navy-800/80 border border-borderBase-dark rounded-2xl p-6 sm:p-8 space-y-5">
              <h3 className="text-xl font-serif font-bold text-white">
                Signature Amenities & Inclusions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg bg-navy-900 border border-borderBase-dark/60 text-xs sm:text-sm text-gray-200"
                  >
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Enquiry Form & Private Broker Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-24 space-y-6">
              <EnquiryForm propertyId={property.id} propertyTitle={property.title} />

              {/* Private Client Advisory Card */}
              <div className="p-5 rounded-xl bg-navy-800/60 border border-borderBase-dark text-xs text-gray-400 space-y-3">
                <div className="flex items-center gap-2 text-gold font-semibold uppercase tracking-wider font-mono">
                  <Shield className="w-4 h-4" />
                  <span>Institutional Assurance</span>
                </div>
                <p className="leading-relaxed">
                  All transactions facilitated through NovaEstate Properties comply with Dubai Land Department (DLD) escrow statutory guidelines. Direct developer pricing guaranteed without agency markups.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Residences in Community */}
        {fallbackProperties.length > 0 && (
          <div className="mt-24 pt-12 border-t border-borderBase-dark">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-gold">
                  Explore Further
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-1">
                  Similar Residences in {property.area}
                </h3>
              </div>
              <Link
                href={`/?area=${encodeURIComponent(property.area)}#listings`}
                className="text-xs font-semibold text-gold hover:text-gold-light uppercase tracking-wider"
              >
                View Community Portfolio →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fallbackProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
