"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const galleryImages = images && images.length > 0 ? images : ["/placeholder-luxury.jpg"];

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  }, [galleryImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  }, [galleryImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);

  return (
    <div className="w-full space-y-3">
      {/* Main Showcase Image */}
      <div className="relative aspect-[16/9] w-full bg-navy-800 rounded-2xl overflow-hidden border border-borderBase-dark group shadow-2xl">
        <img
          src={galleryImages[currentIndex]}
          alt={`${title} - Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
        />

        {/* Previous Button */}
        {galleryImages.length > 1 && (
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-navy-900/80 text-white hover:text-gold hover:bg-navy-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 backdrop-blur-md border border-navy-700"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Button */}
        {galleryImages.length > 1 && (
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-navy-900/80 text-white hover:text-gold hover:bg-navy-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 backdrop-blur-md border border-navy-700"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Expand / Fullscreen Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900/80 text-xs font-medium text-white hover:text-gold backdrop-blur-md border border-navy-700 transition-colors"
          aria-label="View full screen gallery"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Full Screen</span>
        </button>

        {/* Counter Pill */}
        <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded bg-navy-900/80 text-xs font-mono text-gray-300 border border-navy-700 backdrop-blur-md">
          {currentIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Thumbnails Navigation Row */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {galleryImages.map((imgUrl, index) => {
            const isSelected = currentIndex === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all ${
                  isSelected
                    ? "border-gold shadow-gold scale-[1.02]"
                    : "border-borderBase-dark/60 opacity-60 hover:opacity-100"
                }`}
                aria-label={`Show image ${index + 1}`}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-navy-900/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="text-sm font-serif font-semibold text-white">
              {title} <span className="text-gray-400 font-mono text-xs">({currentIndex + 1} of {galleryImages.length})</span>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-lg bg-navy-800 text-gray-300 hover:text-white hover:bg-navy-700 transition-colors"
              aria-label="Close full screen gallery"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Centered Image */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={galleryImages[currentIndex]}
              alt={`${title} enlarged photo`}
              className="max-h-[82vh] max-w-[94vw] object-contain rounded-lg shadow-2xl"
            />

            {/* Left/Right Lightbox Controls */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-navy-800/80 text-white hover:text-gold hover:bg-navy-800 border border-navy-700 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-navy-800/80 text-white hover:text-gold hover:bg-navy-800 border border-navy-700 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-12 rounded overflow-hidden shrink-0 border-2 transition-all ${
                  currentIndex === idx ? "border-gold scale-105" : "border-navy-700 opacity-50 hover:opacity-90"
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
