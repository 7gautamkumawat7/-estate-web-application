import { z } from "zod";

export const propertyFilterSchema = z.object({
  search: z.string().optional(),
  area: z.string().optional(),
  type: z.string().optional(),
  bedrooms: z
    .string()
    .optional()
    .transform((val) => (val && !isNaN(Number(val)) ? Number(val) : undefined)),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val && !isNaN(Number(val)) ? Number(val) : undefined)),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val && !isNaN(Number(val)) ? Number(val) : undefined)),
  status: z.enum(["READY", "OFF_PLAN"]).optional(),
  sort: z.enum(["price-asc", "price-desc", "newest"]).optional().default("newest"),
  page: z
    .string()
    .optional()
    .transform((val) => (val && !isNaN(Number(val)) && Number(val) > 0 ? Number(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val && !isNaN(Number(val)) && Number(val) > 0 ? Number(val) : 9)),
});

export type PropertyFilterParams = z.infer<typeof propertyFilterSchema>;
