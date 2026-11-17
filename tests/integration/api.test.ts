import { describe, it, expect } from "vitest";
import prisma from "@/lib/prisma";
import { GET as getProperties } from "@/app/api/properties/route";
import { GET as getPropertyBySlug } from "@/app/api/properties/[slug]/route";
import { POST as postEnquiry, GET as getEnquiries } from "@/app/api/enquiries/route";
import { PATCH as patchEnquiry } from "@/app/api/enquiries/[id]/route";
import { POST as loginAdmin } from "@/app/api/auth/login/route";
import { NextRequest } from "next/server";

describe("API Integration: Properties Endpoints", () => {
  it("GET /api/properties should return list of seeded properties with pagination meta", async () => {
    const req = new NextRequest("http://localhost:3000/api/properties?page=1&limit=6");
    const res = await getProperties(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    expect(json.meta).toBeDefined();
    expect(json.meta.total).toBeGreaterThanOrEqual(20);
    expect(json.meta.page).toBe(1);
  });

  it("GET /api/properties with area filter should return only matching properties", async () => {
    const req = new NextRequest("http://localhost:3000/api/properties?area=Downtown%20Dubai");
    const res = await getProperties(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    json.data.forEach((p: { area: string }) => {
      expect(p.area).toBe("Downtown Dubai");
    });
  });

  it("GET /api/properties/[slug] should return valid property for existing slug", async () => {
    const req = new NextRequest("http://localhost:3000/api/properties/the-crown-penthouse-palm-jumeirah");
    const res = await getPropertyBySlug(req, {
      params: { slug: "the-crown-penthouse-palm-jumeirah" },
    });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.title).toContain("Crown Penthouse");
    expect(Array.isArray(json.data.images)).toBe(true);
    expect(Array.isArray(json.data.features)).toBe(true);
  });

  it("GET /api/properties/[slug] should return 404 for non-existent slug", async () => {
    const req = new NextRequest("http://localhost:3000/api/properties/nonexistent-property-slug");
    const res = await getPropertyBySlug(req, {
      params: { slug: "nonexistent-property-slug" },
    });
    expect(res.status).toBe(404);
  });
});

describe("API Integration: Enquiries Endpoints", () => {
  it("POST /api/enquiries should successfully create an enquiry for a valid property", async () => {
    // Find an existing property
    const prop = await prisma.property.findFirst();
    expect(prop).toBeDefined();

    const payload = {
      name: "Marcus Aurelius",
      email: "marcus.aurelius@rome.it",
      phone: "+39 06 698 12345",
      message: "Requesting private viewing and acquisition documents.",
      propertyId: prop!.id,
    };

    const req = new NextRequest("http://localhost:3000/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await postEnquiry(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.id).toBeDefined();

    // Verify in database
    const saved = await prisma.enquiry.findUnique({
      where: { id: json.data.id },
    });
    expect(saved).toBeDefined();
    expect(saved?.email).toBe(payload.email);
    expect(saved?.status).toBe("NEW");
  });

  it("POST /api/enquiries should return 422 on invalid payload (bad email)", async () => {
    const prop = await prisma.property.findFirst();
    const payload = {
      name: "Marcus",
      email: "not-an-email",
      phone: "+12345678",
      message: "Interested in this property.",
      propertyId: prop!.id,
    };

    const req = new NextRequest("http://localhost:3000/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await postEnquiry(req);
    expect(res.status).toBe(422);
  });

  it("POST /api/enquiries should return 404 for non-existent propertyId", async () => {
    const payload = {
      name: "Elena Rostova",
      email: "elena@vienna.at",
      phone: "+43 1 515 880",
      message: "Interested in acquiring this residential unit.",
      propertyId: "non-existent-property-id-9999",
    };

    const req = new NextRequest("http://localhost:3000/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await postEnquiry(req);
    expect(res.status).toBe(404);
  });

  it("GET /api/enquiries should return 401 when accessed without admin session", async () => {
    const req = new NextRequest("http://localhost:3000/api/enquiries");
    const res = await getEnquiries(req);
    expect(res.status).toBe(401);
  });
});

describe("API Integration: Admin Authentication & Status Updates", () => {
  it("POST /api/auth/login should authenticate valid admin and set auth cookie", async () => {
    const payload = {
      email: "admin@novaestate.ae",
      password: "AdminNovaPassword2026!",
    };

    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await loginAdmin(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.admin.email).toBe("admin@novaestate.ae");

    // Check cookie
    const cookie = res.cookies.get("nova_admin_token");
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBeDefined();
  });

  it("POST /api/auth/login should reject incorrect password with 401", async () => {
    const payload = {
      email: "admin@novaestate.ae",
      password: "WrongPassword999!",
    };

    const req = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await loginAdmin(req);
    expect(res.status).toBe(401);
  });
});
