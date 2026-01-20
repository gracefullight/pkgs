import { z } from "zod";

/**
 * Schema for getting variant inventory
 */
export const VariantInventoryGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    variant_code: z
      .string()
      .regex(/^[A-Z0-9]{12}$/)
      .describe("Variant code (12 characters, A-Z0-9)"),
  })
  .strict();

export type VariantInventoryGetParams = z.infer<typeof VariantInventoryGetParamsSchema>;

/**
 * Schema for updating variant inventory
 */
export const VariantInventoryUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    variant_code: z
      .string()
      .regex(/^[A-Z0-9]{12}$/)
      .describe("Variant code (12 characters, A-Z0-9)"),
    use_inventory: z
      .enum(["T", "F"])
      .optional()
      .describe("Use inventory management (T: Use, F: Do not use)"),
    important_inventory: z
      .enum(["A", "B"])
      .optional()
      .describe("Important inventory (A: General, B: Important)"),
    inventory_control_type: z
      .enum(["A", "B"])
      .optional()
      .describe("Inventory check criteria (A: Upon order, B: Upon payment)"),
    display_soldout: z
      .enum(["T", "F"])
      .optional()
      .describe("Display out-of-stock icon (T: Display, F: Do not display)"),
    quantity: z.number().int().optional().describe("Available inventory quantity"),
    safety_inventory: z.number().int().optional().describe("Minimum stock level"),
    origin_code: z.string().optional().describe("Shipping origin code"),
  })
  .strict();

export type VariantInventoryUpdateParams = z.infer<typeof VariantInventoryUpdateParamsSchema>;
