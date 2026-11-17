import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "NovaEstate Properties | Luxury Dubai Real Estate & Penthouses",
  description:
    "Discover an exclusive portfolio of prime Dubai residences, waterfront villas, and branded sky penthouses across Palm Jumeirah, Downtown Dubai, and Dubai Marina.",
  keywords: [
    "Dubai luxury real estate",
    "Palm Jumeirah villas",
    "Downtown Dubai penthouses",
    "Dubai Marina waterfront apartments",
    "Dubai off-plan developments",
    "NovaEstate Properties",
  ],
  authors: [{ name: "NovaEstate Properties" }],
  openGraph: {
    title: "NovaEstate Properties | Dubai Luxury Real Estate",
    description:
      "Curators of premier residential real estate in Dubai. Discover ready and off-plan residences with panoramic sea and skyline vistas.",
    url: "https://novaestate.ae",
    siteName: "NovaEstate Properties",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "NovaEstate Properties Dubai Skyline",
      },
    ],
    locale: "en_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaEstate Properties | Dubai Luxury Real Estate",
    description: "Curated residential living in Dubai.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-navy-900 text-gray-100 antialiased selection:bg-gold selection:text-navy-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
