"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw, ChevronDown, Check } from "lucide-react";

const DUBAI_COMMUNITIES = [
  "All",
  "Palm Jumeirah",
  "Downtown Dubai",
  "Dubai Marina",
  "Dubai Hills Estate",
  "Business Bay",
  "Dubai Creek Harbour",
  "Arabian Ranches",
  "Jumeirah Village Circle",
  "Meydan",
  "Jumeirah Lake Towers",
];

const PROPERTY_TYPES = ["All", "Apartment", "Villa", "Penthouse", "Townhouse"];

const BEDROOM_OPTIONS = [
  { label: "All Beds", value: "" },
  { label: "1 Bed", value: "1" },
  { label: "2 Beds", value: "2" },
  { label: "3 Beds", value: "3" },
  { label: "4 Beds", value: "4" },
  { label: "5+ Beds", value: "5" },
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Ready", value: "READY" },
  { label: "Off-Plan", value: "OFF_PLAN" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Local filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [area, setArea] = useState(searchParams.get("area") || "All");
  const [type, setType] = useState(searchParams.get("type") || "All");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  // Keep local state in sync when URL searchParams change (e.g. browser back/forward)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setArea(searchParams.get("area") || "All");
    setType(searchParams.get("type") || "All");
    setBedrooms(searchParams.get("bedrooms") || "");
    setStatus(searchParams.get("status") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSort(searchParams.get("sort") || "newest");
  }, [searchParams]);

  // Synchronize active filters to URL query string
  const updateUrl = (overrides?: Record<string, string | undefined>) => {
    const currentValues = {
      search,
      area: area === "All" ? "" : area,
      type: type === "All" ? "" : type,
      bedrooms,
      status,
      minPrice,
      maxPrice,
      sort: sort === "newest" ? "" : sort,
      page: "1", // Reset to page 1 on filter change
      ...overrides,
    };

    const params = new URLSearchParams();

    Object.entries(currentValues).forEach(([key, val]) => {
      if (val && val.trim() !== "" && val !== "All") {
        params.set(key, val.trim());
      }
    });

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}#listings` : "/#listings";

    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search });
  };

  const handleReset = () => {
    setSearch("");
    setArea("All");
    setType("All");
    setBedrooms("");
    setStatus("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");

    startTransition(() => {
      router.push("/#listings", { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(
    search ||
      (area && area !== "All") ||
      (type && type !== "All") ||
      bedrooms ||
      status ||
      minPrice ||
      maxPrice ||
      (sort && sort !== "newest")
  );

  return (
    <div id="listings" className="w-full bg-navy-800/80 border border-borderBase-dark rounded-2xl p-5 sm:p-6 shadow-xl mb-10">
      {/* Search & Main Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-5">
        {/* Keyword Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
          <input
            type="text"
            placeholder="Search by residence title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-navy-900 border border-borderBase-dark text-white rounded-lg pl-10 pr-24 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gold text-navy-900 text-xs font-semibold rounded-md hover:bg-gold-light transition-colors"
          >
            Apply
          </button>
        </form>

        {/* Quick Area Dropdown */}
        <div className="w-full lg:w-48">
          <select
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              updateUrl({ area: e.target.value });
            }}
            className="w-full bg-navy-900 border border-borderBase-dark text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold transition-colors"
          >
            <option value="All">All Communities</option>
            {DUBAI_COMMUNITIES.filter((c) => c !== "All").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Type Dropdown */}
        <div className="w-full lg:w-40">
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              updateUrl({ type: e.target.value });
            }}
            className="w-full bg-navy-900 border border-borderBase-dark text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold transition-colors"
          >
            <option value="All">All Types</option>
            {PROPERTY_TYPES.filter((t) => t !== "All").map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full lg:w-48">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              updateUrl({ sort: e.target.value });
            }}
            className="w-full bg-navy-900 border border-borderBase-dark text-white text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-gold transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Filter Toggle & Reset Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-navy-700 text-white text-sm rounded-lg hover:bg-navy-600 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <span>More Filters</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs text-gold hover:text-white transition-colors border border-gold/30 rounded-lg hover:border-gold"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Row (Visible on Desktop or when mobile drawer is expanded) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-borderBase-dark/60 ${isMobileOpen ? "block" : "hidden lg:grid"}`}>
        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
            Bedrooms
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {BEDROOM_OPTIONS.slice(0, 6).map((bed) => {
              const isSelected = bedrooms === bed.value;
              return (
                <button
                  key={bed.label}
                  type="button"
                  onClick={() => {
                    const newVal = isSelected ? "" : bed.value;
                    setBedrooms(newVal);
                    updateUrl({ bedrooms: newVal });
                  }}
                  className={`py-1.5 text-xs rounded transition-all font-medium ${
                    isSelected
                      ? "bg-gold text-navy-900 font-bold shadow-sm"
                      : "bg-navy-900 text-gray-300 hover:bg-navy-700 border border-borderBase-dark/60"
                  }`}
                >
                  {bed.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Handover Status */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
            Handover Status
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {STATUS_OPTIONS.map((st) => {
              const isSelected = status === st.value;
              return (
                <button
                  key={st.label}
                  type="button"
                  onClick={() => {
                    const newVal = isSelected ? "" : st.value;
                    setStatus(newVal);
                    updateUrl({ status: newVal });
                  }}
                  className={`py-1.5 text-xs rounded transition-all font-medium ${
                    isSelected
                      ? "bg-gold text-navy-900 font-bold shadow-sm"
                      : "bg-navy-900 text-gray-300 hover:bg-navy-700 border border-borderBase-dark/60"
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Min Price (AED) */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
            Min Price (AED)
          </label>
          <select
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              updateUrl({ minPrice: e.target.value });
            }}
            className="w-full bg-navy-900 border border-borderBase-dark text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          >
            <option value="">No Minimum</option>
            <option value="1000000">1,000,000 AED</option>
            <option value="2500000">2,500,000 AED</option>
            <option value="5000000">5,000,000 AED</option>
            <option value="10000000">10,000,000 AED</option>
            <option value="20000000">20,000,000 AED</option>
          </select>
        </div>

        {/* Max Price (AED) */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">
            Max Price (AED)
          </label>
          <select
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              updateUrl({ maxPrice: e.target.value });
            }}
            className="w-full bg-navy-900 border border-borderBase-dark text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-gold"
          >
            <option value="">No Maximum</option>
            <option value="3000000">3,000,000 AED</option>
            <option value="6000000">6,000,000 AED</option>
            <option value="15000000">15,000,000 AED</option>
            <option value="30000000">30,000,000 AED</option>
            <option value="50000000">50,000,000 AED</option>
          </select>
        </div>
      </div>

      {/* Loading feedback during URL update */}
      {isPending && (
        <div className="mt-3 text-right">
          <span className="text-[11px] text-gold animate-pulse font-mono">
            Refreshing listings...
          </span>
        </div>
      )}
    </div>
  );
}
