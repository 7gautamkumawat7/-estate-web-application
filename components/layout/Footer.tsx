import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-navy-900 border-t border-borderBase-dark text-brandText-secondary pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold">
                <span className="font-serif font-bold text-navy-900 text-base">N</span>
              </div>
              <span className="font-serif tracking-widest text-lg font-semibold text-white">
                NOVA<span className="text-gold font-light">ESTATE</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Curators of Dubai&apos;s most coveted luxury residences, sky penthouses, and private beachfront estates. Delivering discretion, distinction, and world-class architectural living.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-gold">
              <ShieldCheck className="w-4 h-4" />
              <span>RERA Registered Demonstration Platform</span>
            </div>
          </div>

          {/* Featured Communities */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4 font-mono text-gold-light">
              Prime Locations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/?area=Palm%20Jumeirah" className="hover:text-gold transition-colors flex items-center gap-1">
                  Palm Jumeirah <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/?area=Downtown%20Dubai" className="hover:text-gold transition-colors flex items-center gap-1">
                  Downtown Dubai <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/?area=Dubai%20Marina" className="hover:text-gold transition-colors flex items-center gap-1">
                  Dubai Marina <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/?area=Dubai%20Hills%20Estate" className="hover:text-gold transition-colors flex items-center gap-1">
                  Dubai Hills Estate <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/?area=Business%20Bay" className="hover:text-gold transition-colors flex items-center gap-1">
                  Business Bay <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4 font-mono text-gold-light">
              Portfolios
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/?type=Penthouse" className="hover:text-gold transition-colors">
                  Sky Penthouses
                </Link>
              </li>
              <li>
                <Link href="/?type=Villa" className="hover:text-gold transition-colors">
                  Signature Waterfront Villas
                </Link>
              </li>
              <li>
                <Link href="/?status=READY" className="hover:text-gold transition-colors">
                  Ready Key Handover
                </Link>
              </li>
              <li>
                <Link href="/?status=OFF_PLAN" className="hover:text-gold transition-colors">
                  Prime Off-Plan Launches
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold transition-colors">
                  Private Client Office
                </Link>
              </li>
            </ul>
          </div>

          {/* Headquarters */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4 font-mono text-gold-light">
              Dubai Office
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Level 42, Al Sa&apos;ada Tower, DIFC & Downtown, Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>+971 4 800 NOVA (6682)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>privateclient@novaestate.ae</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-borderBase-dark/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} NovaEstate Properties LLC. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-xl text-[11px] text-gray-400">
            *Demonstration notice: Properties and architectural renderings presented are curated portfolio demonstration assets for engineering evaluation and represent non-commercial illustrative listings.
          </p>
        </div>
      </div>
    </footer>
  );
}
