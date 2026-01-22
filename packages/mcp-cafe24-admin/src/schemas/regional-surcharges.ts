import { z } from "zod";

export const GetRegionalSurchargeSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
  })
  .strict();

export const UpdateRegionalSurchargeSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    request: z
      .object({
        use_regional_surcharge: z.enum(["T", "F"]).describe("Enable/Disable regional surcharge"),
        region_setting_type: z
          .enum(["A", "N", "Z"])
          .describe("Shipping zones (A: Quick, N: Area name, Z: Postal code)"),
        jeju_surcharge_amount: z
          .string()
          .regex(/^\d+(\.\d{1,2})?$/)
          .optional()
          .describe("Surcharge for Jeju Island (0 to 999999999, string format)"),
        remote_area_surcharge_amount: z
          .string()
          .regex(/^\d+(\.\d{1,2})?$/)
          .optional()
          .describe("Surcharge for remote areas (0 to 999999999, string format)"),
      })
      .strict(),
  })
  .strict();

export type GetRegionalSurcharge = z.infer<typeof GetRegionalSurchargeSchema>;
export type UpdateRegionalSurcharge = z.infer<typeof UpdateRegionalSurchargeSchema>;
