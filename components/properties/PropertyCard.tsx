"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Square, MapPin, ArrowRight } from "lucide-react";
import { formatAED, formatNumber } from "@/lib/utils";

export interface PropertyCardData {
  id: string;
  slug: string;
  title: string;
  area: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  size: number;
  status: string; // "READY" | "OFF_PLAN"
  imageUrl: string;
  featured?: boolean;
}

interface PropertyCardProps {
  property: PropertyCardData;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation between -6 and +6 degrees for refined luxury feel
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    if (!isTouch) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-6px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
        transition: isHovered
          ? "transform 0.1s ease-out, box-shadow 0.3s ease"
          : "transform 0.5s ease-out, box-shadow 0.5s ease",
      }}
      className="group relative bg-navy-800 border border-borderBase-dark rounded-xl overflow-hidden shadow-premium hover:shadow-premium-hover hover:border-gold/40 flex flex-col will-change-transform"
    >
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-900">
        <img
          src={property.imageUrl}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={`px-2.5 py-1 rounded text-[11px] font-semibold tracking-wider uppercase font-mono shadow-md ${
              property.status === "READY"
                ? "bg-emerald-900/90 text-emerald-300 border border-emerald-500/30"
                : "bg-gold/90 text-navy-900 border border-gold-light"
            }`}
          >
            {property.status === "READY" ? "Ready" : "Off-Plan"}
          </span>

          {property.featured && (
            <span className="px-2.5 py-1 rounded text-[10px] font-semibold tracking-wider uppercase font-mono bg-navy-900/90 text-gold border border-gold/40 backdrop-blur-sm">
              Exclusive
            </span>
          )}
        </div>

        {/* Property Type Floating Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-navy-900/80 text-gray-200 border border-navy-700 backdrop-blur-sm">
            {property.type}
          </span>
        </div>
      </div>

      {/* Property Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location Area */}
          <div className="flex items-center gap-1.5 text-xs text-gold-light mb-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="truncate">{property.area}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-serif font-semibold text-white group-hover:text-gold-light transition-colors line-clamp-1 mb-2">
            <Link
              href={`/properties/${property.slug}`}
              className="focus:outline-none focus:underline"
            >
              {property.title}
            </Link>
          </h3>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-borderBase-dark/60 my-3 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Square className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{formatNumber(property.size)} sq ft</span>
            </div>
          </div>
        </div>

        {/* Footer: Price and CTA */}
        <div className="pt-2 flex items-center justify-between mt-auto">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
              Guide Price
            </div>
            <div className="text-lg font-serif font-bold text-white text-gold-gradient">
              {formatAED(property.price)}
            </div>
          </div>

          <Link
            href={`/properties/${property.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-light group-hover:translate-x-1 transition-all focus:outline-none focus:ring-1 focus:ring-gold rounded px-2 py-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
