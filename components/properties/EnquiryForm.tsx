"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema, type EnquiryFormData } from "@/lib/validations/enquiry";
import { Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

interface EnquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export default function EnquiryForm({ propertyId, propertyTitle }: EnquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      propertyId,
      name: "",
      email: "",
      phone: "",
      message: `I am interested in ${propertyTitle}. Please arrange a consultation or private tour.`,
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Unable to process enquiry at this time.");
      }

      setSubmitSuccess(true);
      reset({
        propertyId,
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-navy-800 border border-borderBase-dark rounded-2xl p-6 sm:p-7 shadow-2xl">
      <div className="mb-5">
        <div className="text-xs font-mono uppercase tracking-wider text-gold mb-1">
          Private Client Advisory
        </div>
        <h3 className="text-xl font-serif font-bold text-white">
          Enquire About This Residence
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          Direct liaison with our Senior Dubai Property Director. Discreet, confidential, and prompt.
        </p>
      </div>

      {submitSuccess ? (
        <div className="p-6 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-serif font-bold text-white">
            Enquiry Received With Distinction
          </h4>
          <p className="text-xs text-emerald-200/90 leading-relaxed max-w-xs mx-auto">
            Thank you. Your dossier has been logged. A NovaEstate Private Client Director will contact you within 2 business hours.
          </p>
          <button
            type="button"
            onClick={() => setSubmitSuccess(false)}
            className="text-xs text-gold underline hover:text-gold-light pt-2 inline-block"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("propertyId")} value={propertyId} />

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Full Name <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Eleanor Vance"
              {...register("name")}
              className={`w-full bg-navy-900 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-borderBase-dark focus:border-gold"
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-[11px] mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Email Address <span className="text-gold">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. eleanor@vance-holdings.com"
              {...register("email")}
              className={`w-full bg-navy-900 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-borderBase-dark focus:border-gold"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Phone / WhatsApp Number <span className="text-gold">*</span>
            </label>
            <input
              type="tel"
              placeholder="+971 50 123 4567"
              {...register("phone")}
              className={`w-full bg-navy-900 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.phone
                  ? "border-red-500 focus:border-red-500"
                  : "border-borderBase-dark focus:border-gold"
              }`}
            />
            {errors.phone && (
              <p className="text-red-400 text-[11px] mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Message / Consultation Request <span className="text-gold">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="State your investment timeframe, financing preference, or specific inquiries..."
              {...register("message")}
              className={`w-full bg-navy-900 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                errors.message
                  ? "border-red-500 focus:border-red-500"
                  : "border-borderBase-dark focus:border-gold"
              }`}
            />
            {errors.message && (
              <p className="text-red-400 text-[11px] mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-gold to-gold-light hover:brightness-105 text-navy-900 font-semibold text-xs uppercase tracking-wider shadow-gold flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Transmitting Dossier...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Private Enquiry</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>Encrypted transmission & strict privacy protection</span>
          </div>
        </form>
      )}
    </div>
  );
}
