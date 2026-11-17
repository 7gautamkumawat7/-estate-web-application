"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Archive,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  X,
  Loader2,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface EnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
  property: {
    id: string;
    title: string;
    slug: string;
    area: string;
    price: number;
  };
}

export default function EnquiryTable() {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected enquiry for inspection modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/enquiries?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        throw new Error("Failed to load enquiries");
      }

      const result = await res.json();
      setEnquiries(result.data || []);
      if (result.meta) {
        setTotalPages(result.meta.totalPages || 1);
        setTotalCount(result.meta.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchEnquiries();
  };

  const handleStatusChange = async (enquiryId: string, newStatus: "NEW" | "CONTACTED" | "CLOSED") => {
    setIsUpdatingStatus(enquiryId);
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Status update failed");

      const result = await res.json();
      // Update locally
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
      if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>New</span>
          </span>
        );
      case "CONTACTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Phone className="w-3 h-3" />
            <span>Contacted</span>
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" />
            <span>Closed</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-navy-800 border border-borderBase-dark text-white rounded-lg pl-10 pr-20 py-2 text-sm placeholder-gray-400 focus:outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-gold text-navy-900 text-xs font-semibold rounded hover:bg-gold-light"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-navy-800 border border-borderBase-dark rounded-lg p-1 text-xs">
            {["ALL", "NEW", "CONTACTED", "CLOSED"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  statusFilter === st
                    ? "bg-gold text-navy-900 font-bold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {st === "ALL" ? "All Dossiers" : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-navy-800 border border-borderBase-dark rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-navy-900/90 text-xs uppercase font-mono tracking-wider text-gray-400 border-b border-borderBase-dark">
              <tr>
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-5">Target Residence</th>
                <th className="py-3.5 px-5">Message Preview</th>
                <th className="py-3.5 px-5">Received</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderBase-dark/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin text-gold mx-auto mb-2" />
                    <span>Retrieving client dossier archive...</span>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <Archive className="w-8 h-8 text-gray-500 mx-auto mb-2 opacity-50" />
                    <p className="text-white font-medium">No client enquiries found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {search || statusFilter !== "ALL"
                        ? "Try clearing your filters or search terms."
                        : "New submissions will appear here automatically."}
                    </p>
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-navy-700/40 transition-colors">
                    {/* Client info */}
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white">{enquiry.name}</div>
                      <div className="text-xs text-gray-400">{enquiry.email}</div>
                      <div className="text-xs text-gold-light/90 font-mono">{enquiry.phone}</div>
                    </td>

                    {/* Property */}
                    <td className="py-4 px-5">
                      <div className="font-medium text-white max-w-[200px] truncate">
                        {enquiry.property?.title || "Unknown Property"}
                      </div>
                      <div className="text-xs text-gold flex items-center gap-1">
                        <span>{enquiry.property?.area}</span>
                        {enquiry.property?.slug && (
                          <Link
                            href={`/properties/${enquiry.property.slug}`}
                            target="_blank"
                            className="hover:underline inline-flex items-center"
                          >
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </Link>
                        )}
                      </div>
                    </td>

                    {/* Message Preview */}
                    <td className="py-4 px-5 max-w-[260px]">
                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                        &quot;{enquiry.message}&quot;
                      </p>
                    </td>

                    {/* Received Date */}
                    <td className="py-4 px-5 text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(enquiry.createdAt)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      {getStatusBadge(enquiry.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-navy-700 text-xs font-medium text-gray-200 hover:text-white hover:bg-navy-600 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold" />
                        <span>View</span>
                      </button>

                      {/* Quick Status Dropdown */}
                      <select
                        value={enquiry.status}
                        disabled={isUpdatingStatus === enquiry.id}
                        onChange={(e) =>
                          handleStatusChange(enquiry.id, e.target.value as "NEW" | "CONTACTED" | "CLOSED")
                        }
                        className="bg-navy-900 border border-borderBase-dark text-xs text-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-gold disabled:opacity-50"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="py-3 px-5 bg-navy-900/60 border-t border-borderBase-dark flex items-center justify-between text-xs text-gray-400">
          <div>
            Showing {enquiries.length} of {totalCount} total dossiers
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded bg-navy-800 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white px-2">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded bg-navy-800 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedEnquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-navy-800 border border-gold/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-borderBase-dark pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-gold">
                  Client Enquiry Dossier
                </span>
                <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-navy-900 p-3.5 rounded-lg border border-borderBase-dark">
                <div>
                  <div className="text-gray-400 font-mono uppercase text-[10px]">Email</div>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="text-white hover:text-gold flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span className="truncate">{selectedEnquiry.email}</span>
                  </a>
                </div>
                <div>
                  <div className="text-gray-400 font-mono uppercase text-[10px]">Phone</div>
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    className="text-white hover:text-gold flex items-center gap-1 mt-0.5 font-mono"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>{selectedEnquiry.phone}</span>
                  </a>
                </div>
              </div>

              <div>
                <div className="text-gray-400 font-mono uppercase text-[10px] mb-1">
                  Enquired Property
                </div>
                <div className="bg-navy-900 p-3 rounded-lg border border-borderBase-dark flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{selectedEnquiry.property?.title}</div>
                    <div className="text-gray-400 text-[11px]">{selectedEnquiry.property?.area}</div>
                  </div>
                  {selectedEnquiry.property?.slug && (
                    <Link
                      href={`/properties/${selectedEnquiry.property.slug}`}
                      target="_blank"
                      className="px-2.5 py-1 bg-navy-800 text-gold rounded border border-gold/30 hover:bg-gold hover:text-navy-900 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Listing</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>

              <div>
                <div className="text-gray-400 font-mono uppercase text-[10px] mb-1">
                  Full Consultation Message
                </div>
                <div className="bg-navy-900 p-4 rounded-lg border border-borderBase-dark text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="flex items-center justify-between text-gray-400 text-[11px] pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                  Received: {formatDate(selectedEnquiry.createdAt)}
                </span>
                <div>Status: {getStatusBadge(selectedEnquiry.status)}</div>
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="border-t border-borderBase-dark pt-4 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-400">Update Dossier:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedEnquiry.id, "NEW")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold ${
                    selectedEnquiry.status === "NEW"
                      ? "bg-amber-500 text-navy-900"
                      : "bg-navy-900 text-amber-300 border border-amber-500/40 hover:bg-amber-500/10"
                  }`}
                >
                  Mark New
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedEnquiry.id, "CONTACTED")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold ${
                    selectedEnquiry.status === "CONTACTED"
                      ? "bg-blue-500 text-navy-900"
                      : "bg-navy-900 text-blue-300 border border-blue-500/40 hover:bg-blue-500/10"
                  }`}
                >
                  Mark Contacted
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedEnquiry.id, "CLOSED")}
                  className={`px-3 py-1.5 rounded text-xs font-semibold ${
                    selectedEnquiry.status === "CLOSED"
                      ? "bg-emerald-500 text-navy-900"
                      : "bg-navy-900 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/10"
                  }`}
                >
                  Mark Closed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
