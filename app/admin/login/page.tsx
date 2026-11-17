"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@novaestate.ae");
  const [password, setPassword] = useState("AdminNovaPassword2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Authentication failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid credentials or server error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 py-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        {/* Brand Monogram */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
              <span className="font-serif font-bold text-navy-900 text-lg">N</span>
            </div>
            <span className="font-serif tracking-widest text-xl font-semibold text-white">
              NOVA<span className="text-gold font-light">ESTATE</span>
            </span>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Executive Portal
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Restricted administrative gateway for NovaEstate Private Office
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-navy-800 border border-gold/30 rounded-2xl p-7 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/70 border border-red-500/40 flex items-center gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                Executive Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-navy-900 border border-borderBase-dark text-white rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy-900 border border-borderBase-dark text-white rounded-lg pl-10 pr-3.5 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-gold to-gold-light hover:brightness-105 text-navy-900 font-semibold text-xs uppercase tracking-wider shadow-gold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Seed demo credentials helper */}
          <div className="mt-6 pt-5 border-t border-borderBase-dark/60 text-center">
            <span className="text-[11px] text-gray-400 block font-mono">
              Pre-seeded Administrative Credentials:
            </span>
            <div className="mt-1 text-[11px] font-mono text-gold-light/90 bg-navy-900/80 p-2 rounded border border-borderBase-dark inline-block">
              admin@novaestate.ae / AdminNovaPassword2026!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
