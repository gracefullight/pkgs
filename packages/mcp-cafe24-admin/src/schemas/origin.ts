import { z } from "zod";

export const ListOriginsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Shop Number"),
    origin_place_no: z.string().optional().describe("Origin place no"),
    origin_place_name: z.string().max(50).optional().describe("Origin place name"),
    foreign: z.enum(["T", "F"]).optional().describe("Foreign (T: True, F: False)"),
    offset: z
      .number()
      .int()
      .min(0)
      .max(8000)
      .optional()
      .default(0)
      .describe("Start location of list"),
    limit: z.number().int().min(1).max(100).optional().default(10).describe("Limit"),
  })
  .strict();

export type ListOrigins = z.infer<typeof ListOriginsSchema>;
