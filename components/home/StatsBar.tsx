import React from "react";
import { Building2, CheckCircle2, Clock, Landmark } from "lucide-react";

interface StatsProps {
  stats: {
    totalProperties: number;
    readyProperties: number;
    offPlanProperties: number;
    communitiesCount: number;
  };
}

export default function StatsBar({ stats }: StatsProps) {
  const items = [
    {
      label: "Curated Residences",
      value: `${stats.totalProperties || 22}+`,
      subtext: "Prime Dubai Listings",
      icon: Building2,
    },
    {
      label: "Ready for Handover",
      value: stats.readyProperties || 14,
      subtext: "Immediate Key Collection",
      icon: CheckCircle2,
    },
    {
      label: "Off-Plan Launches",
      value: stats.offPlanProperties || 8,
      subtext: "Exclusive Developer Allocations",
      icon: Clock,
    },
    {
      label: "Prime Communities",
      value: stats.communitiesCount || 10,
      subtext: "Across Dubai Districts",
      icon: Landmark,
    },
  ];

  return (
    <div className="relative -mt-8 z-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="luxury-glass rounded-2xl p-6 sm:p-8 shadow-2xl border border-gold/20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-borderBase-dark/60">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-4 ${
                idx > 0 && idx % 2 === 0 ? "pt-6 lg:pt-0" : ""
              } ${idx % 2 === 1 ? "pt-6 sm:pt-0" : ""} lg:px-6 first:pl-0 last:pr-0`}
            >
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs font-semibold text-gold uppercase tracking-wider font-mono">
                  {item.label}
                </div>
                <div className="text-[11px] text-gray-400 hidden sm:block">
                  {item.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
