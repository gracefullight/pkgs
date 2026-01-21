import { z } from "zod";

export const ListCustomerMemosParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    member_id: z.string().max(20).describe("Member ID"),
    start_date: z.string().optional().describe("Search Start Date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("Search End Date (YYYY-MM-DD)"),
    important_flag: z.enum(["T", "F"]).optional().describe("Important memo (T: Yes, F: No)"),
    memo: z.string().optional().describe("Search text in memo description"),
    offset: z.number().int().min(0).max(10000).default(0).describe("Start location of list"),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit"),
  })
  .strict();

export const CountCustomerMemosParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    member_id: z.string().max(20).describe("Member ID"),
  })
  .strict();

export const RetrieveCustomerMemoParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    member_id: z.string().max(20).describe("Member ID"),
    memo_no: z.number().int().describe("Memo Number"),
  })
  .strict();

export const CreateCustomerMemoParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    member_id: z.string().max(20).describe("Member ID"),
    request: z
      .object({
        author_id: z.string().max(20).describe("Author ID"),
        memo: z.string().describe("Memo description (HTML allowed)"),
        important_flag: z
          .enum(["T", "F"])
          .default("F")
          .describe("Important memo (T: Yes, F: No, default: F)"),
      })
      .strict(),
  })
  .strict();

export const UpdateCustomerMemoParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    member_id: z.string().max(20).describe("Member ID"),
    memo_no: z.number().int().describe("Memo Number"),
    request: z
      .object({
        author_id: z.string().max(20).describe("Author ID"),
        memo: z.string().optional().describe("Memo description (HTML allowed)"),
        important_flag: z.enum(["T", "F"]).optional().describe("Important memo (T: Yes, F: No)"),
      })
      .strict(),
  })
  .strict();

export const DeleteCustomerMemoParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    member_id: z.string().max(20).describe("Member ID"),
    memo_no: z.number().int().describe("Memo Number"),
  })
  .strict();
