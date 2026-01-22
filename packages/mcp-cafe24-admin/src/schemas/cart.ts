import { z } from "zod";

export const ListProductCartsParamsSchema = z
  .object({
    shop_no: z.number().default(1).describe("Shop Number"),
    product_no: z.number().describe("Product number"),
    limit: z.number().min(1).max(100).default(10).describe("Limit"),
    offset: z.number().max(10000).default(0).describe("Start location of list"),
  })
  .strict();

export const CountProductCartsParamsSchema = z
  .object({
    shop_no: z.number().default(1).describe("Shop Number"),
    product_no: z.number().describe("Product number"),
  })
  .strict();
