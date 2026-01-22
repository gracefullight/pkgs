import { z } from "zod";

export const GetSalesVolumeSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    product_no: z.string().optional().describe("Product number (comma separated)"),
    variants_code: z.string().optional().describe("Variant code (comma separated)"),
    category_no: z.number().int().optional().describe("Category number"),
    mobile: z
      .enum(["T", "F"])
      .optional()
      .describe("Whether it is mobile or PC (T: Mobile, F: Others)"),
    delivery_type: z
      .enum(["A", "B"])
      .optional()
      .describe("Delivery type (A: Domestic, B: Overseas)"),
    group_no: z.number().int().optional().describe("Member level number"),
    supplier_id: z.string().max(20).optional().describe("Supplier ID"),
    start_date: z.string().describe("Search Start Date (YYYY-MM-DD HH:MM:SS)"),
    end_date: z.string().describe("Search End Date (YYYY-MM-DD HH:MM:SS)"),
  })
  .strict()
  .refine((data) => data.product_no || data.variants_code, {
    message: "Either 'product_no' or 'variants_code' is necessary for search.",
    path: ["product_no"],
  });

export type GetSalesVolume = z.infer<typeof GetSalesVolumeSchema>;
