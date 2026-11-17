import React from "react";
import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-navy-900 px-4 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6">
        <div className="text-7xl sm:text-8xl font-serif font-bold text-gold-gradient tracking-widest">
          404
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Residence Not Located
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed max-w-md mx-auto">
            The private portfolio item or URL you requested is unavailable or has been acquired. Browse our active collection of Dubai luxury developments below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/#listings"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold hover:bg-gold-light text-navy-900 text-xs font-semibold uppercase tracking-wider transition-all shadow-gold"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Active Listings</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-navy-800 border border-borderBase-dark hover:border-gold/50 text-white text-xs font-medium transition-all"
          >
            <Home className="w-4 h-4 text-gold" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
