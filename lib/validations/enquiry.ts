import { z } from "zod";

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email cannot exceed 150 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .max(25, "Phone number cannot exceed 25 characters")
    .regex(/^[+0-9\s\-().]+$/, "Phone number contains invalid characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
  propertyId: z.string().min(1, "Property ID is required"),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;
export type UpdateEnquiryStatusData = z.infer<typeof updateEnquiryStatusSchema>;
