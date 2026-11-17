"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-navy-900 px-4 py-16">
      <div className="luxury-glass rounded-2xl max-w-md w-full p-8 text-center border border-red-500/30 shadow-2xl space-y-5">
        <div className="w-14 h-14 rounded-full bg-red-900/30 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Temporary System Interruption
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            We encountered a temporary discrepancy while retrieving luxury residence data. Please attempt to re-render or return to the main portfolio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gold text-navy-900 text-xs font-semibold uppercase tracking-wider hover:bg-gold-light transition-all shadow-gold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-navy-800 border border-borderBase-dark text-white text-xs font-medium hover:border-gold/50 transition-all"
          >
            <Home className="w-4 h-4 text-gold" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
