"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, Compass, Home, Phone, Info } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Properties", href: "/#listings", icon: Compass },
    { name: "About", href: "/#about", icon: Info },
    { name: "Contact", href: "/#contact", icon: Phone },
  ];

  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isAdminRoute
          ? "bg-navy-900/90 backdrop-blur-md border-b border-borderBase-dark/60 py-3.5 shadow-lg"
          : "bg-gradient-to-b from-navy-900/80 via-navy-900/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-gold rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold transition-transform duration-300 group-hover:scale-105">
              <span className="font-serif font-bold text-navy-900 text-lg tracking-wider">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif tracking-widest text-lg font-semibold text-white group-hover:text-gold-light transition-colors">
                NOVA<span className="text-gold font-light">ESTATE</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-brandText-secondary -mt-1 font-mono">
                Dubai Properties
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-gold focus:outline-none focus:ring-1 focus:ring-gold rounded px-2 py-1 ${
                    isActive ? "text-gold" : "text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-gold ${
                isAdminRoute
                  ? "bg-gold text-navy-900 font-semibold shadow-gold"
                  : "text-brandText-secondary hover:text-gold border border-borderBase-dark/70 hover:border-gold/50 bg-navy-800/40"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>

            <Link
              href="/#listings"
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-r from-gold to-gold-light text-navy-900 text-xs font-semibold tracking-wide uppercase transition-all duration-300 hover:brightness-105 hover:shadow-gold focus:outline-none focus:ring-2 focus:ring-gold"
            >
              Browse Residences
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900/98 border-b border-borderBase-dark px-4 pt-4 pb-6 mt-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base text-gray-200 hover:bg-navy-800 hover:text-gold transition-colors"
                >
                  <Icon className="w-5 h-5 text-gold" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-navy-800 flex flex-col gap-2.5">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-brandText-secondary hover:text-gold hover:bg-navy-800 transition-colors"
              >
                <Shield className="w-4 h-4 text-gold" />
                <span>Admin Dashboard</span>
              </Link>
              <Link
                href="/#listings"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-md bg-gold text-navy-900 font-semibold text-sm uppercase tracking-wider"
              >
                Explore Properties
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
