import { z } from "zod";

export const CustomerEventsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    name: z.string().max(200).optional().describe("Event name"),
    search_date: z
      .enum(["created_date", "start_date", "end_date"])
      .default("created_date")
      .describe("Search date (created_date, start_date, end_date)"),
    start_date: z.string().optional().describe("Search start date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("Search end date (YYYY-MM-DD)"),
    offset: z.number().int().min(0).max(8000).default(0).describe("Start location of list"),
    limit: z.number().int().min(1).max(100).default(10).describe("Limit"),
  })
  .strict();

export const CustomerEventCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        type: z
          .enum(["E", "P", "L"])
          .describe("Event type (E: update info, P: change password, L: lifetime)"),
        name: z.string().min(1).max(200).describe("Event name"),
        description: z.string().max(200).optional().describe("Event description"),
        start_date: z.string().optional().describe("Event start time"),
        end_date: z.string().optional().describe("Event end time"),
        items: z
          .array(z.enum(["zipcode", "address", "cellphone", "password", "sms", "email"]))
          .max(6)
          .optional()
          .describe("Event items"),
        reward_condition: z
          .enum(["O", "A"])
          .optional()
          .describe("Event conditions (O: any item, A: all items)"),
        agree_restriction: z
          .enum(["T", "F"])
          .optional()
          .describe("Benefit eligibility settings for email/SMS acceptance"),
        agree_restriction_period: z
          .number()
          .int()
          .optional()
          .describe("Email/SMS acceptance lock-in period (1,3,6,12,-1)"),
        auto_reward: z.enum(["T", "F"]).optional().describe("Automatic benefit issuance settings"),
        use_point: z.enum(["T", "F"]).optional().describe("Automatically issued point use"),
        point_amount: z.string().optional().describe("Automatically issued point amount"),
        use_coupon: z.enum(["T", "F"]).optional().describe("Automatically issued coupon use"),
        coupon_no: z.string().optional().describe("Automatically issued coupon number"),
        popup_notification: z
          .enum(["T", "F"])
          .optional()
          .describe("Lifetime member event popup notification"),
      })
      .strict()
      .describe("Customer event request"),
  })
  .strict();

export const CustomerEventStatusUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        no: z.array(z.number().int()).min(1).describe("Event numbers"),
        status: z.enum(["S", "D"]).describe("Campaign status (S: Ended, D: Deleted)"),
      })
      .strict()
      .describe("Customer event status update request"),
  })
  .strict();

export type CustomerEventsSearchParams = z.infer<typeof CustomerEventsSearchParamsSchema>;
export type CustomerEventCreateParams = z.infer<typeof CustomerEventCreateParamsSchema>;
export type CustomerEventStatusUpdateParams = z.infer<typeof CustomerEventStatusUpdateParamsSchema>;
