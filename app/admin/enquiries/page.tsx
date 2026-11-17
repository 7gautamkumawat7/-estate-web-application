import React from "react";
import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/auth";
import EnquiryTable from "@/components/admin/EnquiryTable";
import LogoutButton from "@/components/admin/LogoutButton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const admin = await getSessionAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-navy-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-borderBase-dark mb-8">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-light mb-2 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">
              Client Enquiries &amp; Consultations
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Complete archive of submitted investor inquiries across all Dubai developments
            </p>
          </div>

          <LogoutButton />
        </div>

        <EnquiryTable />
      </div>
    </div>
  );
}
