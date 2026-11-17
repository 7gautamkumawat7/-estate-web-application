import { describe, it, expect } from "vitest";
import { propertyFilterSchema } from "@/lib/validations/property";
import { enquirySchema, updateEnquiryStatusSchema } from "@/lib/validations/enquiry";

// Sample mock properties for pure unit filter logic testing
const mockProperties = [
  {
    id: "1",
    title: "The Marina Loft",
    area: "Dubai Marina",
    type: "Apartment",
    bedrooms: 2,
    price: 2500000,
    status: "READY",
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "2",
    title: "Downtown Sky Palace",
    area: "Downtown Dubai",
    type: "Penthouse",
    bedrooms: 4,
    price: 15000000,
    status: "READY",
    createdAt: new Date("2026-02-01"),
  },
  {
    id: "3",
    title: "JVC Garden Suite",
    area: "Jumeirah Village Circle",
    type: "Apartment",
    bedrooms: 1,
    price: 950000,
    status: "READY",
    createdAt: new Date("2026-03-01"),
  },
  {
    id: "4",
    title: "Palm Jumeirah Villa",
    area: "Palm Jumeirah",
    type: "Villa",
    bedrooms: 5,
    price: 45000000,
    status: "OFF_PLAN",
    createdAt: new Date("2026-04-01"),
  },
  {
    id: "5",
    title: "Dubai Hills Fairway",
    area: "Dubai Hills Estate",
    type: "Villa",
    bedrooms: 5,
    price: 18000000,
    status: "OFF_PLAN",
    createdAt: new Date("2026-05-01"),
  },
];

// Pure filter logic helper matching application behavior
function applyFilters(
  properties: typeof mockProperties,
  filters: {
    area?: string;
    bedrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    sort?: string;
    search?: string;
  }
) {
  return properties
    .filter((p) => {
      if (filters.search && !p.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.area && filters.area !== "All" && p.area !== filters.area) {
        return false;
      }
      if (filters.bedrooms !== undefined) {
        if (filters.bedrooms >= 5 && p.bedrooms < 5) return false;
        if (filters.bedrooms < 5 && p.bedrooms !== filters.bedrooms) return false;
      }
      if (filters.minPrice !== undefined && p.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && p.price > filters.maxPrice) {
        return false;
      }
      if (filters.status && p.status !== filters.status) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price;
      if (filters.sort === "price-desc") return b.price - a.price;
      return b.createdAt.getTime() - a.createdAt.getTime(); // default newest
    });
}

describe("Unit: Property Filter Logic", () => {
  it("filters correctly by area (Dubai Marina)", () => {
    const results = applyFilters(mockProperties, { area: "Dubai Marina" });
    expect(results.length).toBe(1);
    expect(results[0].title).toBe("The Marina Loft");
  });

  it("filters correctly by bedroom count (1 bed vs 5+ beds)", () => {
    const oneBeds = applyFilters(mockProperties, { bedrooms: 1 });
    expect(oneBeds.length).toBe(1);
    expect(oneBeds[0].title).toBe("JVC Garden Suite");

    const fiveBeds = applyFilters(mockProperties, { bedrooms: 5 });
    expect(fiveBeds.length).toBe(2);
    fiveBeds.forEach((p) => expect(p.bedrooms).toBeGreaterThanOrEqual(5));
  });

  it("filters correctly by price range (minPrice and maxPrice)", () => {
    const results = applyFilters(mockProperties, {
      minPrice: 1000000,
      maxPrice: 20000000,
    });
    expect(results.length).toBe(3); // 2.5M, 15M, 18M
    results.forEach((p) => {
      expect(p.price).toBeGreaterThanOrEqual(1000000);
      expect(p.price).toBeLessThanOrEqual(20000000);
    });
  });

  it("filters correctly by ready / off-plan status", () => {
    const ready = applyFilters(mockProperties, { status: "READY" });
    expect(ready.length).toBe(3);
    ready.forEach((p) => expect(p.status).toBe("READY"));

    const offPlan = applyFilters(mockProperties, { status: "OFF_PLAN" });
    expect(offPlan.length).toBe(2);
    offPlan.forEach((p) => expect(p.status).toBe("OFF_PLAN"));
  });

  it("sorts correctly by price ascending and descending", () => {
    const asc = applyFilters(mockProperties, { sort: "price-asc" });
    expect(asc[0].price).toBe(950000);
    expect(asc[asc.length - 1].price).toBe(45000000);

    const desc = applyFilters(mockProperties, { sort: "price-desc" });
    expect(desc[0].price).toBe(45000000);
    expect(desc[desc.length - 1].price).toBe(950000);
  });

  it("combines multiple filters together (area + status + price range + sort)", () => {
    const results = applyFilters(mockProperties, {
      status: "READY",
      maxPrice: 5000000,
      sort: "price-asc",
    });
    expect(results.length).toBe(2); // 950k, 2.5M
    expect(results[0].title).toBe("JVC Garden Suite");
    expect(results[1].title).toBe("The Marina Loft");
  });
});

describe("Unit: Property Filter Parameter Validation & Normalization", () => {
  it("should normalize valid query parameters", () => {
    const raw = {
      search: "Penthouse",
      area: "Palm Jumeirah",
      type: "Penthouse",
      bedrooms: "4",
      minPrice: "5000000",
      maxPrice: "20000000",
      status: "READY",
      sort: "price-asc",
      page: "2",
      limit: "9",
    };

    const result = propertyFilterSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.bedrooms).toBe(4);
      expect(result.data.minPrice).toBe(5000000);
      expect(result.data.maxPrice).toBe(20000000);
      expect(result.data.page).toBe(2);
      expect(result.data.sort).toBe("price-asc");
      expect(result.data.status).toBe("READY");
    }
  });

  it("should gracefully fallback on invalid or negative page numbers", () => {
    const raw = {
      page: "-5",
      limit: "not-a-number",
    };

    const result = propertyFilterSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(9);
    }
  });

  it("should reject invalid status options", () => {
    const raw = {
      status: "INVALID_STATUS",
    };

    const result = propertyFilterSchema.safeParse(raw);
    expect(result.success).toBe(false);
  });

  it("should default sort to newest when omitted", () => {
    const raw = {};
    const result = propertyFilterSchema.safeParse(raw);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sort).toBe("newest");
    }
  });
});

describe("Unit: Enquiry Form Zod Validation", () => {
  it("should accept valid enquiry data", () => {
    const validData = {
      name: "Tariq Mansoor",
      email: "tariq@investor.ae",
      phone: "+971 50 987 6543",
      message: "Requesting financial dossier and floorplan specifications.",
      propertyId: "test-property-id-123",
    };

    const result = enquirySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const invalidData = {
      name: "Tariq Mansoor",
      email: "not-an-email",
      phone: "+971 50 987 6543",
      message: "Requesting financial dossier.",
      propertyId: "test-property-id-123",
    };

    const result = enquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  it("should reject short message or short name", () => {
    const invalidData = {
      name: "T",
      email: "valid@email.com",
      phone: "123",
      message: "Hi",
      propertyId: "prop-id",
    };

    const result = enquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should validate enquiry status updates correctly", () => {
    expect(updateEnquiryStatusSchema.safeParse({ status: "NEW" }).success).toBe(true);
    expect(updateEnquiryStatusSchema.safeParse({ status: "CONTACTED" }).success).toBe(true);
    expect(updateEnquiryStatusSchema.safeParse({ status: "CLOSED" }).success).toBe(true);
    expect(updateEnquiryStatusSchema.safeParse({ status: "UNKNOWN" }).success).toBe(false);
  });
});
