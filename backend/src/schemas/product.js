import { z } from "zod";

// Image schema for product images
const imageSchema = z.object({
  url: z.string().trim().min(1, "Image URL is required"),
  alt: z.string().trim().optional().default(""),
  isPrimary: z.boolean().optional().default(false),
  order: z.number().min(0, "Order must be non-negative").optional().default(0),
  publicId: z.string().trim().optional(),
});

// Dimensions schema
const dimensionsSchema = z.object({
  length: z.number().min(0, "Length must be non-negative").optional(),
  width: z.number().min(0, "Width must be non-negative").optional(),
  height: z.number().min(0, "Height must be non-negative").optional(),
  unit: z.enum(["cm", "in"]).default("cm"),
});

// Main product creation schema
export const productCreateSchema = z
  .object({
    name: z.string().trim().min(1, "Product name is required"),
    slug: z.string().toLowerCase().optional(),

    images: z
      .array(imageSchema)
      .min(1, "Product must have at least one image")
      .refine(
        (images) => {
          // Ensure only one primary image
          const primaryImages = images.filter((img) => img.isPrimary);
          return primaryImages.length <= 1;
        },
        {
          message: "Only one image can be marked as primary",
        }
      ),

    brand: z.string().trim().min(1, "Brand is required"),
    categories: z
      .array(
        z.string().trim().min(1, "Product must have at least one category")
      )
      .min(1, "Product must have at least one category"),

    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(2000, "Description cannot exceed 2000 characters"),
    shortDescription: z
      .string()
      .trim()
      .max(300, "Short description cannot exceed 300 characters")
      .optional(),

    seoTitle: z
      .string()
      .trim()
      .max(60, "SEO title cannot exceed 60 characters")
      .optional(),
    seoDescription: z
      .string()
      .trim()
      .max(160, "SEO description cannot exceed 160 characters")
      .optional(),

    specifications: z.record(z.string(), z.string()).optional(),

    weight: z.number().min(0, "Weight cannot be negative").optional(),
    dimensions: dimensionsSchema.optional(),

    price: z.number().min(0, "Price cannot be negative"),
    comparePrice: z
      .number()
      .min(0, "Compare price cannot be negative")
      .optional(),
    costPrice: z.number().min(0, "Cost price cannot be negative").optional(),

    countInStock: z
      .number()
      .min(0, "Stock count cannot be negative")
      .default(0),

    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.comparePrice && data.price && data.comparePrice < data.price) {
      ctx.addIssue({
        code: "custom",
        message:
          "Compare price should be greater than or equal to selling price",
        path: ["comparePrice"],
      });
    }
  });
