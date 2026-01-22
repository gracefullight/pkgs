import { z } from "zod";

export const ListCategoryProductsSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    category_no: z.number().int().describe("Category number"),
    display_group: z
      .number()
      .int()
      .min(1)
      .max(3)
      .describe("Display group (1: Normal, 2: Recommendation, 3: New)"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50000)
      .optional()
      .default(50000)
      .describe("Maximum number of results"),
  })
  .strict();

export const CountCategoryProductsSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    category_no: z.number().int().describe("Category number"),
    display_group: z
      .number()
      .int()
      .min(1)
      .max(3)
      .describe("Display group (1: Normal, 2: Recommendation, 3: New)"),
  })
  .strict();

export const AddCategoryProductsSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    category_no: z.number().int().describe("Category number"),
    display_group: z
      .number()
      .int()
      .min(1)
      .max(3)
      .optional()
      .default(1)
      .describe("Display group (1: Normal, 2: Recommendation, 3: New)"),
    product_no: z.array(z.number().int()).min(1).describe("List of product numbers to add"),
  })
  .strict();

export const UpdateCategoryProductSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    category_no: z.number().int().describe("Category number"),
    display_group: z
      .number()
      .int()
      .min(1)
      .max(3)
      .describe("Display group (1: Normal, 2: Recommendation, 3: New)"),
    product_no: z.number().int().describe("Product number"),
    sequence: z.number().int().min(1).max(999999).optional().describe("Display sequence"),
    auto_sort: z.enum(["T", "F"]).optional().describe("Auto sort enabled (T: Use, F: Do not use)"),
    fixed_sort: z
      .enum(["T", "F"])
      .optional()
      .describe("Fixed sort enabled (T: Use, F: Do not use)"),
  })
  .strict();

export const RemoveCategoryProductSchema = z
  .object({
    shop_no: z.number().int().optional().default(1).describe("Shop number"),
    category_no: z.number().int().describe("Category number"),
    product_no: z.number().int().describe("Product number"),
    display_group: z
      .number()
      .int()
      .min(1)
      .max(3)
      .optional()
      .default(1)
      .describe("Display group (1: Normal, 2: Recommendation, 3: New)"),
  })
  .strict();
