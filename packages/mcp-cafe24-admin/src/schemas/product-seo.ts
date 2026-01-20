import { z } from "zod";

/**
 * Schema for getting product SEO settings
 */
export const ProductSeoGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export type ProductSeoGetParams = z.infer<typeof ProductSeoGetParamsSchema>;

/**
 * Schema for updating product SEO settings
 */
export const ProductSeoUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    meta_title: z
      .string()
      .optional()
      .describe("Browser title - Title tag displayed on product detail page"),
    meta_author: z.string().optional().describe("Meta Author - Author information for the product"),
    meta_description: z
      .string()
      .optional()
      .describe("Meta Description - Brief description displayed in search results"),
    meta_keywords: z
      .string()
      .optional()
      .describe("Meta Keywords - Search keywords for the product"),
    meta_alt: z
      .string()
      .optional()
      .describe("Product image alt text - Improves image search visibility and accessibility"),
    search_engine_exposure: z
      .enum(["T", "F"])
      .optional()
      .describe("Search engine exposure (T: Expose, F: Do not expose)"),
  })
  .strict();

export type ProductSeoUpdateParams = z.infer<typeof ProductSeoUpdateParamsSchema>;
