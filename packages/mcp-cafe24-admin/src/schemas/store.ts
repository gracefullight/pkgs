import { z } from "zod";

export const UsersSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    search_type: z.enum(["member_id", "name"]).optional().describe("Search type"),
    keyword: z.string().optional().describe("Search keyword"),
    admin_type: z.enum(["P", "A"]).optional().describe("Admin type: P=Principal, A=Sub-admin"),
  })
  .strict();

export const UserDetailParamsSchema = z
  .object({
    user_id: z.string().describe("User ID"),
    shop_no: z.number().int().min(1).default(1).describe("Shop number"),
  })
  .strict();

export const ShopsSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    shop_no: z.number().optional().describe("Filter by specific shop number"),
  })
  .strict();

export const StoreDetailParamsSchema = z
  .object({
    shop_no: z.number().optional().describe("Shop number for multi-store malls"),
  })
  .strict();

export const StoreAccountsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();
