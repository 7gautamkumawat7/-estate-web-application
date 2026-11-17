"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Compass, MapPin, Sparkles, Building2, KeyRound } from "lucide-react";

interface HeroParallaxProps {
  onSearchSubmit?: (query: string) => void;
}

export default function HeroParallax({ onSearchSubmit }: HeroParallaxProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [searchInput, setSearchInput] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return;
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();

    const x = (clientX - left - width / 2) / (width / 2);
    const y = (clientY - top - height / 2) / (height / 2);

    // Subtle restrained factor
    setOffset({ x: x * 15, y: y * 15 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchInput);
    } else {
      const target = document.getElementById("listings");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-navy-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8 perspective-1000"
    >
      {/* Background Architectural Layer with 3D Parallax */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-500 ease-out will-change-transform scale-105"
        style={{
          transform: `translate3d(${offset.x * -0.5}px, ${offset.y * -0.5}px, 0)`,
          backgroundImage: `radial-gradient(circle at 50% 30%, rgba(23, 35, 45, 0.4) 0%, rgba(16, 24, 32, 0.95) 85%), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=85')`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      />

      {/* Subtle Lighting Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Card Left (Depth Layer 1) */}
      <div
        className="hidden lg:flex absolute left-8 xl:left-20 top-1/3 luxury-glass p-4 rounded-xl items-center gap-3.5 shadow-2xl transition-transform duration-700 ease-out pointer-events-none z-20 border border-gold/25"
        style={{
          transform: `translate3d(${offset.x * 1.2}px, ${offset.y * 1.2}px, 30px)`,
        }}
      >
        <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-gold font-mono">Prime Handover</div>
          <div className="text-sm font-semibold text-white">Palm Jumeirah Crown</div>
          <div className="text-xs text-gray-400">AED 38,500,000</div>
        </div>
      </div>

      {/* Floating Card Right (Depth Layer 2) */}
      <div
        className="hidden lg:flex absolute right-8 xl:right-24 bottom-1/4 luxury-glass p-4 rounded-xl items-center gap-3.5 shadow-2xl transition-transform duration-700 ease-out pointer-events-none z-20 border border-gold/25"
        style={{
          transform: `translate3d(${offset.x * -1.2}px, ${offset.y * -1.2}px, 40px)`,
        }}
      >
        <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-gold font-mono">Downtown Dubai</div>
          <div className="text-sm font-semibold text-white">Burj Opera Panorama</div>
          <div className="text-xs text-gray-400">Ready 2 & 3 Bedroom Suites</div>
        </div>
      </div>

      {/* Main Foreground Content */}
      <div
        className="relative z-30 max-w-4xl mx-auto text-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${offset.x * 0.4}px, ${offset.y * 0.4}px, 0)`,
        }}
      >
        {/* Curated Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/80 border border-gold/40 text-gold-light text-xs font-medium tracking-wide mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Curated Architectural Living in Dubai</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-6">
          Find Your Place <br className="hidden sm:inline" />
          in <span className="text-gold-gradient italic">Dubai</span>.
        </h1>

        {/* Supporting description */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Explore signature waterfront villas, branded skyline penthouses, and premier off-plan developments across the Emirates’ most prestigious communities.
        </p>

        {/* Search Input Bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-8 bg-navy-800/90 backdrop-blur-xl p-2 rounded-xl border border-borderBase-dark focus-within:border-gold/60 transition-all shadow-2xl flex items-center gap-2"
        >
          <div className="pl-3 text-gold">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search by community (e.g. Palm Jumeirah, Downtown, Marina)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent border-none text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none py-2 px-2"
          />
          <button
            type="submit"
            className="shrink-0 px-5 sm:px-6 py-2.5 rounded-lg bg-gold hover:bg-gold-light text-navy-900 font-semibold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-gold"
          >
            Search
          </button>
        </form>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#listings"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-gradient-to-r from-gold to-gold-light text-navy-900 font-semibold text-sm tracking-wider uppercase transition-all hover:shadow-gold hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Properties</span>
          </Link>

          <Link
            href="/?area=Palm%20Jumeirah"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-navy-800/70 border border-borderBase-dark hover:border-gold/50 text-white font-medium text-sm tracking-wide transition-all hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <MapPin className="w-4 h-4 text-gold" />
            <span>Discover Communities</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
