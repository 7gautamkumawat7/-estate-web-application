# NovaEstate Properties — Premium Dubai Real Estate Platform

> **Curating Dubai's finest architectural residences, sky penthouses, and private beachfront estates.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Database-Neon_PostgreSQL-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1-729B1B?style=flat&logo=vitest)](https://vitest.dev/)
[![Status](https://img.shields.io/badge/Production_Build-Passing-brightgreen?style=flat)]()

---

## 1. Project Overview

**NovaEstate Properties** is a production-oriented, full-stack international luxury real estate web platform focused on discovering, browsing, filtering, and enquiring about residential properties in **Dubai, United Arab Emirates**.

Designed with a high-end architectural identity, it combines modern luxury aesthetics, subtle 3D interactions and perspective transforms, server-side dynamic filtering with full URL synchronization, persistent client consultation management, and an enterprise-grade administrative dashboard powered by **Neon Serverless PostgreSQL**.

---

## 2. Platform Architecture & Mermaid Diagram

NovaEstate is built as a unified Next.js 14+ App Router application with full-stack TypeScript, Prisma ORM, and Neon Serverless PostgreSQL.

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Browser)"]
        UI["Modern Luxury UI (Tailwind + Framer Motion)"]
        Parallax["Hero 3D Parallax & Depth Layers"]
        Filters["Property Filters (URL Sync / SearchParams)"]
        Cards["3D Perspective Tilt Property Cards"]
        Gallery["Image Gallery & Fullscreen Lightbox"]
        ThreeCanvas["Three.js Interactive 3D Architectural Scene"]
        EnquiryForm["Enquiry Submission Form (Zod + React Hook Form)"]
        AdminUI["Admin Dashboard & Enquiry Dossiers"]
    end

    subgraph Server ["Server Layer (Next.js 14+ App Router)"]
        SSR["Server Component Rendering (RSC)"]
        PropRoute["GET /api/properties (Multi-filter, Sort, Paginate)"]
        DetailRoute["GET /api/properties/:slug"]
        EnquiryPost["POST /api/enquiries (Rate Limiter + Zod Validation)"]
        EnquiryAdmin["GET & PATCH /api/enquiries/:id (Admin Auth)"]
        AuthRoute["POST /api/auth/login & logout (JWT HttpOnly Cookies)"]
        StatsRoute["GET /api/admin/stats & /api/stats"]
    end

    subgraph Security ["Security & Middleware"]
        RateLimit["Sliding Window In-Memory Rate Limiter"]
        Bcrypt["Bcrypt Password Hashing"]
        Jose["Jose JWT Verification & HttpOnly Cookies"]
    end

    subgraph Data ["Data Layer"]
        Prisma["Prisma ORM (PrismaClient Singleton)"]
        Neon["Neon Serverless PostgreSQL (Connection Pooler)"]
    end

    UI --> Filters
    Filters --> |URL query params| SSR
    SSR --> Prisma
    Cards --> DetailRoute
    EnquiryForm --> EnquiryPost
    AdminUI --> AuthRoute
    AdminUI --> EnquiryAdmin
    EnquiryPost --> RateLimit
    AuthRoute --> Bcrypt
    AuthRoute --> Jose
    EnquiryAdmin --> Jose
    Prisma --> Neon
```

---

## 3. Key Features

### Premium Dubai Real Estate UI/UX
- **Bespoke Color Palette**: Deep Navy (`#101820`), Secondary Navy (`#17232D`), Surface White (`#FFFFFF`), Champagne Gold (`#C6A66B`), Secondary Gold (`#D9C29A`), and Slate borders (`#E8E8E8`).
- **Typography & Atmosphere**: Editorial serif headers with geometric clean accents, gold gradients, and responsive glassmorphism.

### Subtle 3D Interactions & Spatial Effects
- **Hero Parallax**: Desktop cursor-reactive depth layers separating architectural Dubai photography from floating status badges without layout shift.
- **3D Card Perspective Tilt**: Smooth `rotateX` / `rotateY` transforms based on pointer coordinates; automatically disabled on touch devices.
- **Three.js Architectural Volume**: Interactive 3D cantilevered sky penthouse model with drag rotation, realistic glass/metal materials, and static fallback.

### Comprehensive Search & Filtering (Server-Side)
- **Multi-Criteria Filtering**: Title/Keyword search, Community/Area filter, Property Type (Apartment, Villa, Penthouse, Townhouse), Bedroom count (1–5+), Min/Max AED price, and Handover status (Ready vs. Off-Plan).
- **Sorting**: Newest first, Price: Low to High, Price: High to Low.
- **Full URL Synchronization**: Active filters are mapped to URL query params (e.g. `/?area=Palm%20Jumeirah&bedrooms=4&sort=price-desc`), allowing bookmarking, browser back/forward navigation, and instant page refreshes without state loss.
- **Pagination**: Server-side pagination with previous/next controls and numbered page links.

### Dynamic Property Detail Pages (`/properties/[slug]`)
- Full architectural narrative and key specifications (Bedrooms, Bathrooms, Sq Ft, Status, Guide Price).
- **Interactive Image Gallery**: Main photo showcase, thumbnail strip navigation, and fullscreen lightbox modal with keyboard navigation (`Left`, `Right`, `Escape`).
- **Private Client Enquiry Form**: Validated with Zod and React Hook Form, submitting directly to Neon PostgreSQL with instant visual feedback and spam throttling.
- **Similar Residences**: Dynamically queries and displays properties located in the same Dubai district.

### Secure Administrative Portal (`/admin` & `/admin/enquiries`)
- **Server-Side Protected Routes**: Unauthenticated users are redirected to `/admin/login`.
- **Live Database Metrics**: Overview counters for Total Properties, Total Enquiries, New Enquiries, Contacted Enquiries, Closed Enquiries, and Prime Districts directly queried from Neon.
- **Enquiry Management**: Search client dossiers by name, email, or phone; filter by status (`NEW`, `CONTACTED`, `CLOSED`); pagination; full message preview modal; and live status updating via PATCH endpoint.
- **Session Security**: Pure JS bcrypt password hashing, 24-hour signed JWT stored in secure `HttpOnly`, `SameSite=lax` cookies.

---

## 4. Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14.2.24 (App Router) |
| **Language** | TypeScript 5.6 (Strict Mode) |
| **Styling** | Tailwind CSS 3.4, PostCSS, Autoprefixer |
| **Animations & 3D** | Framer Motion, CSS 3D Perspective, Three.js 0.169 |
| **Icons** | Lucide React |
| **Forms & Validation**| React Hook Form 7.53, Zod 3.23, @hookform/resolvers |
| **Database** | Neon Serverless PostgreSQL with Prisma ORM 6.19 |
| **Authentication** | Jose (JWT), BcryptJS, HttpOnly Cookie Sessions |
| **Testing** | Vitest 2.1, React Testing Library, Playwright (E2E) |

---

## 5. Database Schema

```prisma
model Property {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  description String
  area        String    // Dubai Marina, Downtown Dubai, Palm Jumeirah, etc.
  type        String    // Apartment, Villa, Penthouse, Townhouse
  bedrooms    Int
  bathrooms   Int
  price       Float     // Price in AED
  size        Int       // Size in sq ft
  status      String    @default("READY") // "READY" or "OFF_PLAN"
  imageUrl    String
  images      String    // JSON array of image URLs
  features    String    // JSON array of amenities
  featured    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  enquiries   Enquiry[]

  @@index([area])
  @@index([type])
  @@index([price])
  @@index([bedrooms])
  @@index([status])
}

model Enquiry {
  id         String   @id @default(cuid())
  name       String
  email      String
  phone      String
  message    String
  propertyId String
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  status     String   @default("NEW") // "NEW", "CONTACTED", "CLOSED"
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([propertyId])
  @@index([status])
  @@index([createdAt])
}

model Admin {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         String   @default("ADMIN")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 6. Project Structure

```
novaestate-properties/
├── app/
│   ├── layout.tsx                 # Root layout with navbar, footer, metadata
│   ├── page.tsx                   # Homepage with SSR filters, 3D cards, pagination
│   ├── globals.css                # Luxury variables, 3D perspective styles
│   ├── loading.tsx                # Luxury animated loading state
│   ├── error.tsx                  # Error boundary with retry CTA
│   ├── not-found.tsx              # Custom 404 page
│   ├── sitemap.ts                 # Dynamic XML sitemap
│   ├── robots.ts                  # Search engine robots.txt
│   ├── properties/
│   │   └── [slug]/
│   │       └── page.tsx           # Dynamic property detail page
│   ├── admin/
│   │   ├── page.tsx               # Admin overview with live DB metrics
│   │   ├── login/
│   │   │   └── page.tsx           # Admin authentication page
│   │   └── enquiries/
│   │       └── page.tsx           # Full enquiry management archive
│   └── api/
│       ├── properties/
│       │   ├── route.ts           # GET /api/properties
│       │   └── [slug]/route.ts    # GET /api/properties/[slug]
│       ├── enquiries/
│       │   ├── route.ts           # POST (public) & GET (admin) /api/enquiries
│       │   └── [id]/route.ts      # GET & PATCH (admin status update) /api/enquiries/[id]
│       ├── auth/
│       │   ├── login/route.ts     # POST /api/auth/login
│       │   ├── logout/route.ts    # POST /api/auth/logout
│       │   └── me/route.ts        # GET /api/auth/me
│       ├── stats/route.ts         # GET /api/stats (public statistics)
│       └── admin/stats/route.ts   # GET /api/admin/stats (admin metrics)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Responsive sticky navbar
│   │   └── Footer.tsx             # Luxury brand footer with Dubai districts
│   ├── home/
│   │   ├── HeroParallax.tsx       # Subtle 3D parallax hero
│   │   ├── StatsBar.tsx           # Live statistics counter bar
│   │   └── PropertyFilters.tsx    # Multi-criteria filter suite with URL sync
│   ├── properties/
│   │   ├── PropertyCard.tsx       # 3D perspective tilt card
│   │   ├── PropertyGallery.tsx    # Showcase gallery with lightbox modal
│   │   ├── EnquiryForm.tsx        # Client consultation request form
│   │   └── PropertyModel3D.tsx    # Three.js 3D architectural model
│   ├── admin/
│   │   ├── EnquiryTable.tsx       # Searchable, filterable client table
│   │   └── LogoutButton.tsx       # Admin logout trigger
│   └── ui/
│       └── LoadingSkeleton.tsx    # Shimmer skeleton loader
├── lib/
│   ├── prisma.ts                  # PrismaClient singleton
│   ├── auth.ts                    # JWT token signing, verification & session helper
│   ├── rate-limit.ts              # In-memory sliding window rate limiter
│   ├── utils.ts                   # Currency formatter (AED), date formatting
│   ├── api/
│   │   └── response.ts            # Standardized typed API response helpers
│   └── validations/
│       ├── enquiry.ts             # Zod validation schema for enquiries
│       └── property.ts            # Zod validation schema for filter params
├── prisma/
│   ├── schema.prisma              # Neon PostgreSQL schema
│   └── seed.ts                    # Idempotent 22-property Dubai demonstration seed
├── public/
│   ├── favicon.svg                # Brand monogram favicon
│   └── favicon.ico
├── tests/
│   ├── setup.ts                   # Vitest setup
│   ├── unit/
│   │   └── filters.test.ts        # Filter & validation unit tests (14 tests)
│   ├── integration/
│   │   └── api.test.ts            # API route integration tests (10 tests)
│   └── e2e/
│       └── novaestate.spec.ts     # Playwright end-to-end specifications
├── playwright.config.ts           # Playwright E2E configuration
├── vitest.config.ts               # Vitest runner configuration
├── tailwind.config.js             # Brand luxury color palette
├── next.config.mjs                # Next.js production configuration
└── package.json
```

---

## 7. Setup & Run Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
`.env` / `.env.local` contains:
```env
DATABASE_URL="postgresql://user:password@ep-host.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="super-secure-novaestate-jwt-secret-production-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_DEFAULT_EMAIL="admin@novaestate.ae"
ADMIN_DEFAULT_PASSWORD="AdminNovaPassword2026!"
```

### 3. Synchronize Schema & Seed
```bash
npx prisma db push
npm run prisma:seed
```

### 4. Run Tests & Production Build
```bash
npm test
npm run build
```

### 5. Start Development or Production Server
```bash
# Development
npm run dev

# Production
npm start
```

---

## 8. Verification & Admin Credentials
- **Public Portal**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3000/admin/login`
- **Administrator**: `admin@novaestate.ae`
- **Password**: `AdminNovaPassword2026!`
- **Test Suite**: 24/24 unit & integration tests passing against Neon PostgreSQL.
