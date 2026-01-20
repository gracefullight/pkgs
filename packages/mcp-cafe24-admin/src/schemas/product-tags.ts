import { z } from "zod";

/**
 * Schema for getting/counting product tags
 */
export const ProductTagsGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export type ProductTagsGetParams = z.infer<typeof ProductTagsGetParamsSchema>;

/**
 * Schema for creating product tags
 */
export const ProductTagsCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    tags: z
      .array(z.string())
      .min(1)
      .max(100)
      .describe("Product tags array (required, max 100 tags)"),
  })
  .strict();

export type ProductTagsCreateParams = z.infer<typeof ProductTagsCreateParamsSchema>;

/**
 * Schema for deleting a product tag
 */
export const ProductTagDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    tag: z.string().describe("Tag to delete (required)"),
  })
  .strict();

export type ProductTagDeleteParams = z.infer<typeof ProductTagDeleteParamsSchema>;
