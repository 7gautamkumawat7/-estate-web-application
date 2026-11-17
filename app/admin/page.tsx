import React from "react";
import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import EnquiryTable from "@/components/admin/EnquiryTable";
import LogoutButton from "@/components/admin/LogoutButton";
import Link from "next/link";
import {
  Building2,
  Mail,
  Clock,
  PhoneCall,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight,
  Landmark,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await getSessionAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  // Fetch live database metrics directly on server
  const [
    totalProperties,
    totalEnquiries,
    newEnquiries,
    contactedEnquiries,
    closedEnquiries,
    distinctAreas,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.count({ where: { status: "CONTACTED" } }),
    prisma.enquiry.count({ where: { status: "CLOSED" } }),
    prisma.property.findMany({ select: { area: true }, distinct: ["area"] }),
  ]);

  const statCards = [
    {
      label: "Total Properties",
      value: totalProperties,
      icon: Building2,
      subtext: "Across Dubai Communities",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Total Enquiries",
      value: totalEnquiries,
      icon: Mail,
      subtext: "All-time client dossiers",
      color: "text-gold",
      bg: "bg-gold/10 border-gold/20",
    },
    {
      label: "New Enquiries",
      value: newEnquiries,
      icon: Clock,
      subtext: "Requires consultation liaison",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Contacted",
      value: contactedEnquiries,
      icon: PhoneCall,
      subtext: "Under active discussion",
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Closed / Concluded",
      value: closedEnquiries,
      icon: CheckCircle2,
      subtext: "Transacted or finalized",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Prime Districts",
      value: distinctAreas.length,
      icon: Landmark,
      subtext: "Active territory presence",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-navy-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderBase-dark mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Executive Security Clearance: {admin.role}</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Admin Overview &amp; Enquiries
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Authenticated as <span className="text-white font-medium">{admin.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-800 border border-borderBase-dark text-xs font-medium text-gray-300 hover:text-white hover:border-gold/50 transition-colors"
            >
              <span>View Public Portal</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
            </Link>

            <LogoutButton />
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-navy-800/90 border border-borderBase-dark rounded-xl p-4 shadow-xl flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase text-gray-400 tracking-wider">
                    {stat.label}
                  </span>
                  <div className={`p-1.5 rounded-lg border ${stat.bg} ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enquiry Dossier Management Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold text-white">
                Client Enquiry Management
              </h2>
              <p className="text-xs text-gray-400">
                Review, filter, inspect, and update private client consultation requests
              </p>
            </div>
          </div>

          <EnquiryTable />
        </div>
      </div>
    </div>
  );
}
