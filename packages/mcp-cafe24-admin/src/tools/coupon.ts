import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const CouponSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const RecoverCouponSettingSchema = z
  .object({
    restore_viewpoint: z
      .enum(["A", "B"])
      .optional()
      .describe("Restore timing: A=On request, B=On completion"),
    cancel_before_pay: z
      .enum(["T", "F", "M"])
      .optional()
      .describe("Cancel before payment: T=Auto restore, F=No restore, M=Confirm"),
    cancel_after_pay: z
      .enum(["T", "F", "M"])
      .optional()
      .describe("Cancel after payment: T=Auto restore, F=No restore, M=Confirm"),
    return: z
      .enum(["T", "F", "M"])
      .optional()
      .describe("Return: T=Auto restore, F=No restore, M=Confirm"),
    exchange: z
      .enum(["T", "F", "M"])
      .optional()
      .describe("Exchange: T=Auto restore, F=No restore, M=Confirm"),
    part: z
      .enum(["F", "M"])
      .optional()
      .describe("Partial cancel/return/exchange: F=No restore, M=Confirm"),
  })
  .strict();

const MaxCouponCountSchema = z
  .object({
    product_per_product: z.number().int().min(0).optional().describe("Product coupons per product"),
    product_per_item: z.number().int().min(0).optional().describe("Product coupons per item"),
    order_per_order: z.number().int().min(0).optional().describe("Order coupons per order"),
    product_and_order_per_order: z
      .number()
      .int()
      .min(0)
      .optional()
      .describe("Total coupons per order"),
    product_per_order: z.number().int().min(0).optional().describe("Product coupons per order"),
    product_and_order_per_day: z.number().int().min(0).optional().describe("Total coupons per day"),
  })
  .strict();

const ExpirationNoticeDateSchema = z
  .object({
    one_day: z.enum(["T", "F"]).optional().describe("1 day before: T=Yes, F=No"),
    three_day: z.enum(["T", "F"]).optional().describe("3 days before: T=Yes, F=No"),
    seven_day: z.enum(["T", "F"]).optional().describe("7 days before: T=Yes, F=No"),
  })
  .strict();

const ExpirationNoticeSettingSchema = z
  .object({
    expiration_notice_date_type: z
      .enum(["C", "A"])
      .optional()
      .describe("Notice type: C=Custom dates, A=All dates"),
    expiration_notice_date: ExpirationNoticeDateSchema.optional().describe("Notice dates"),
  })
  .strict();

const AdditionalCouponSchema = z
  .object({
    coupon_no: z.string().describe("Coupon number"),
  })
  .strict();

const CouponSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_coupon: z.enum(["T", "F"]).optional().describe("Enable coupons: T=Yes, F=No"),
    available_issue_type: z
      .enum(["A", "O", "P"])
      .optional()
      .describe("Coupon type: A=Order+Product, O=Order only, P=Product only"),
    allow_using_coupons_with_points: z
      .enum(["T", "F"])
      .optional()
      .describe("Use with points: T=Yes, F=No"),
    allow_using_coupons_with_discounts: z
      .enum(["A", "C", "G"])
      .optional()
      .describe("Use with discounts: A=Both, C=Coupon only, G=Grade discount only"),
    allow_using_product_and_order_coupons: z
      .enum(["T", "F"])
      .optional()
      .describe("Use product+order coupons together: T=Yes, F=No"),
    recover_coupon_setting: RecoverCouponSettingSchema.optional().describe(
      "Coupon recovery settings",
    ),
    max_coupon_count: MaxCouponCountSchema.optional().describe("Coupon usage limits"),
    use_additional_coupon: z
      .enum(["T", "F"])
      .optional()
      .describe("Enable additional coupons: T=Yes, F=No"),
    additional_coupon_no: z
      .array(AdditionalCouponSchema)
      .max(5)
      .optional()
      .describe("Additional coupon numbers (max 5)"),
    expiration_notice_date_setting: ExpirationNoticeSettingSchema.optional().describe(
      "Expiration notice settings",
    ),
    show_coupon_to_non_members: z
      .enum(["T", "F"])
      .optional()
      .describe("Show to non-members: T=Yes, F=No"),
    show_group_coupon_to_non_members: z
      .enum(["T", "F"])
      .optional()
      .describe("Include grade discount coupons: T=Yes, F=No"),
    show_issued_coupon: z.enum(["T", "F"]).optional().describe("Show issued coupons: T=Yes, F=No"),
    sorting_type: z
      .enum(["A", "B", "C", "D", "E"])
      .optional()
      .describe("Sort by: A=Start date, B=End date, C=Issue date, D=Amount, E=Rate"),
    download_image_type: z
      .enum(["1", "2", "3", "4", "5"])
      .optional()
      .describe("Download image type: 1-5"),
    background_image_type: z
      .enum(["1", "2", "3", "4", "5"])
      .optional()
      .describe("Background image type: 1-5"),
  })
  .strict();

async function cafe24_get_coupon_setting(params: z.infer<typeof CouponSettingParamsSchema>) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/coupons/setting", "GET", undefined, queryParams);
    const coupon = data.coupon || data;

    const issueTypeMap: Record<string, string> = {
      A: "Order + Product coupons",
      O: "Order coupons only",
      P: "Product coupons only",
    };

    const discountMap: Record<string, string> = {
      A: "Coupon + Grade discount",
      C: "Coupon only",
      G: "Grade discount only",
    };

    const sortingMap: Record<string, string> = {
      A: "Start date",
      B: "End date",
      C: "Issue date",
      D: "Discount amount",
      E: "Discount rate",
    };

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Coupon Settings (Shop #${coupon.shop_no || 1})\n\n` +
            `- **Use Coupon**: ${coupon.use_coupon === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Issue Type**: ${issueTypeMap[coupon.available_issue_type] || coupon.available_issue_type}\n` +
            `- **Use with Points**: ${coupon.allow_using_coupons_with_points === "T" ? "Yes" : "No"}\n` +
            `- **Use with Discounts**: ${discountMap[coupon.allow_using_coupons_with_discounts] || coupon.allow_using_coupons_with_discounts}\n` +
            `- **Product + Order Together**: ${coupon.allow_using_product_and_order_coupons === "T" ? "Yes" : "No"}\n` +
            `- **Additional Coupon**: ${coupon.use_additional_coupon === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Show to Non-members**: ${coupon.show_coupon_to_non_members === "T" ? "Yes" : "No"}\n` +
            `- **Sorting**: ${sortingMap[coupon.sorting_type] || coupon.sorting_type}\n`,
        },
      ],
      structuredContent: {
        shop_no: coupon.shop_no ?? 1,
        use_coupon: coupon.use_coupon,
        available_issue_type: coupon.available_issue_type,
        allow_using_coupons_with_points: coupon.allow_using_coupons_with_points,
        allow_using_coupons_with_discounts: coupon.allow_using_coupons_with_discounts,
        allow_using_product_and_order_coupons: coupon.allow_using_product_and_order_coupons,
        recover_coupon_setting: coupon.recover_coupon_setting,
        max_coupon_count: coupon.max_coupon_count,
        use_additional_coupon: coupon.use_additional_coupon,
        additional_coupon_no: coupon.additional_coupon_no,
        expiration_notice_date_setting: coupon.expiration_notice_date_setting,
        show_coupon_to_non_members: coupon.show_coupon_to_non_members,
        show_group_coupon_to_non_members: coupon.show_group_coupon_to_non_members,
        show_issued_coupon: coupon.show_issued_coupon,
        sorting_type: coupon.sorting_type,
        download_image_type: coupon.download_image_type,
        background_image_type: coupon.background_image_type,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_coupon_setting(
  params: z.infer<typeof CouponSettingUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/coupons/setting", "PUT", requestBody);
    const coupon = data.coupon || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Coupon Settings Updated (Shop #${coupon.shop_no || 1})\n\n` +
            `- **Use Coupon**: ${coupon.use_coupon === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Use with Points**: ${coupon.allow_using_coupons_with_points === "T" ? "Yes" : "No"}\n` +
            `- **Show to Non-members**: ${coupon.show_coupon_to_non_members === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        shop_no: coupon.shop_no ?? 1,
        use_coupon: coupon.use_coupon,
        available_issue_type: coupon.available_issue_type,
        allow_using_coupons_with_points: coupon.allow_using_coupons_with_points,
        allow_using_coupons_with_discounts: coupon.allow_using_coupons_with_discounts,
        allow_using_product_and_order_coupons: coupon.allow_using_product_and_order_coupons,
        recover_coupon_setting: coupon.recover_coupon_setting,
        max_coupon_count: coupon.max_coupon_count,
        use_additional_coupon: coupon.use_additional_coupon,
        additional_coupon_no: coupon.additional_coupon_no,
        expiration_notice_date_setting: coupon.expiration_notice_date_setting,
        show_coupon_to_non_members: coupon.show_coupon_to_non_members,
        show_group_coupon_to_non_members: coupon.show_group_coupon_to_non_members,
        show_issued_coupon: coupon.show_issued_coupon,
        sorting_type: coupon.sorting_type,
        download_image_type: coupon.download_image_type,
        background_image_type: coupon.background_image_type,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_coupon_setting",
    {
      title: "Get Cafe24 Coupon Settings",
      description:
        "Retrieve coupon settings including usage, issue type, discount combinations, recovery settings, usage limits, expiration notices, and display options.",
      inputSchema: CouponSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_coupon_setting,
  );

  server.registerTool(
    "cafe24_update_coupon_setting",
    {
      title: "Update Cafe24 Coupon Settings",
      description:
        "Update coupon settings including usage, issue type (A=Order+Product, O=Order, P=Product), discount combinations, recovery settings, usage limits, expiration notices, and display options.",
      inputSchema: CouponSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_coupon_setting,
  );
}
