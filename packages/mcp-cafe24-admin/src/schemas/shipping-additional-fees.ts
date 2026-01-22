import { z } from "zod";

export const ListAdditionalFeesSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    limit: z.number().int().min(1).max(500).optional().default(100).describe("Limit"),
    offset: z.number().int().min(0).max(500).optional().default(0).describe("Offset"),
  })
  .strict();

export type ListAdditionalFees = z.infer<typeof ListAdditionalFeesSchema>;
