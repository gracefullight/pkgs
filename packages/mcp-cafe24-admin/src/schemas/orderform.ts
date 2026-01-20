import { z } from "zod";

export const OrderFormSettingsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
  })
  .strict();

export const ShippingOrderInfoSchema = z.object({
  key: z.string().describe("Field key (e.g., name, address, phone)"),
  use: z.enum(["T", "F"]).describe("Use field"),
  required: z.enum(["T", "F"]).describe("Is field required"),
});

export const PrintTypeSchema = z.object({
  invoice_print: z.enum(["T", "F"]).optional().describe("Invoice print button"),
  receipt_print: z.enum(["T", "F"]).optional().describe("Receipt print button"),
  address_print: z.enum(["T", "F"]).optional().describe("Address print button"),
});

export const UpdateOrderFormSettingsParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Multi-shop number (default: 1)"),
    buy_limit_type: z
      .enum(["M", "A"])
      .optional()
      .describe("Buy limit type (M: Member only, A: All)"),
    guest_purchase_button_display: z
      .enum(["T", "F"])
      .optional()
      .describe("Display guest purchase button"),
    junior_purchase_block: z.enum(["T", "F"]).optional().describe("Block purchase for under 14"),
    reservation_order: z.enum(["T", "F"]).optional().describe("Reservation order"),
    discount_amount_display: z.enum(["T", "F"]).optional().describe("Display discount amount"),
    order_item_delete: z.enum(["T", "F"]).optional().describe("Allow deleting order items"),
    quick_signup: z.enum(["T", "F"]).optional().describe("Quick signup in order form"),
    check_order_info: z.enum(["T", "F"]).optional().describe("Check order info"),
    order_form_input_type: z
      .enum(["A", "S"])
      .optional()
      .describe("Order form input type (A: Shipping only, S: Separate)"),
    shipping_info: z
      .array(ShippingOrderInfoSchema)
      .optional()
      .describe("Shipping info fields settings"),
    order_info: z.array(ShippingOrderInfoSchema).optional().describe("Order info fields settings"),
    china_taiwan_id_input: z.enum(["T", "F"]).optional().describe("Input ID for China/Taiwan"),
    print_type: PrintTypeSchema.optional().describe("Print button settings"),
    orderform_additional_enabled: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable additional order form fields"),
  })
  .strict();
