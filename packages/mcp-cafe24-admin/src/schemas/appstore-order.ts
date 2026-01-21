import { z } from "zod";

export const AppstoreOrderDetailParamsSchema = z
  .object({
    order_id: z.string().describe("App store order ID"),
  })
  .strict();

export const AppstoreOrderCreateRequestSchema = z
  .object({
    order_name: z.string().max(100).describe("Order name"),
    order_amount: z.string().describe("Order amount"),
    return_url: z.string().max(250).describe("Return URL"),
    automatic_payment: z
      .enum(["T", "F"])
      .optional()
      .describe("Automatic payment (T: Use, F: Do not use)"),
  })
  .strict();

export const AppstoreOrderCreateParamsSchema = z
  .object({
    request: AppstoreOrderCreateRequestSchema,
  })
  .strict();

export type AppstoreOrderDetailParams = z.infer<typeof AppstoreOrderDetailParamsSchema>;
export type AppstoreOrderCreateParams = z.infer<typeof AppstoreOrderCreateParamsSchema>;
export type AppstoreOrderCreateRequest = z.infer<typeof AppstoreOrderCreateRequestSchema>;
