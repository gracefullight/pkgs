import { z } from "zod";

export const SalesSearchParamsSchema = z
  .object({
    start_date: z.string().describe("Start date (YYYY-MM-DD)"),
    end_date: z.string().describe("End date (YYYY-MM-DD)"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
  })
  .strict();

export type SalesSearchParams = z.infer<typeof SalesSearchParamsSchema>;
