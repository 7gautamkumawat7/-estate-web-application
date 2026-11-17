import React from "react";

export function PropertyCardSkeleton() {
  return (
    <div className="bg-navy-800 border border-borderBase-dark rounded-xl overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-[16/10] bg-navy-700/60 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="h-3.5 bg-navy-700/60 rounded w-1/3 mb-2.5" />
          <div className="h-5 bg-navy-700/60 rounded w-4/5 mb-4" />
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-borderBase-dark/40">
            <div className="h-3 bg-navy-700/60 rounded" />
            <div className="h-3 bg-navy-700/60 rounded" />
            <div className="h-3 bg-navy-700/60 rounded" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-navy-700/60 rounded w-1/2" />
          <div className="h-4 bg-navy-700/60 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <PropertyCardSkeleton key={idx} />
      ))}
    </div>
  );
}
