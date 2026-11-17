import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-navy-900 text-center px-4">
      <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center mb-4 shadow-gold">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
      <h3 className="text-lg font-serif font-semibold text-white tracking-wide">
        Curating Prime Dubai Residences
      </h3>
      <p className="text-xs font-mono text-gold-light mt-1">
        NOVAESTATE PROPERTIES
      </p>
    </div>
  );
}
