import { z } from "zod";

export const OrdersSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    order_id: z.string().optional().describe("Filter by specific order ID(s), comma-separated"),
    start_date: z.string().optional().describe("Filter orders from this date (YYYY-MM-DD)"),
    end_date: z.string().optional().describe("Filter orders until this date (YYYY-MM-DD)"),
    order_status_code: z.string().optional().describe("Filter by order status code"),
  })
  .strict();

export const OrderDetailParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
  })
  .strict();

export const OrderUpdateStatusParamsSchema = z
  .object({
    order_id: z.string().describe("Order ID"),
    order_status_code: z.string().describe("New order status code"),
  })
  .strict();

export const OrderStatusSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const OrderStatusRequestSchema = z.object({
  status_name_id: z.number().int().describe("Status name ID"),
  custom_name: z.string().optional().describe("Custom status name"),
  reservation_custom_name: z.string().optional().describe("Custom reservation status name"),
});

export const OrderStatusUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    requests: z.array(OrderStatusRequestSchema).describe("List of status updates"),
  })
  .strict();
