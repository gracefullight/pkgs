import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const BenefitSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const BenefitSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_gift: z.enum(["T", "F"]).optional().describe("Enable gift feature: T=Yes, F=No"),
    available_payment_methods: z
      .enum(["all", "bank_only", "exclude_bank"])
      .optional()
      .describe("Payment methods for gifts: all, bank_only, exclude_bank"),
    allow_point_payment: z
      .enum(["T", "F"])
      .optional()
      .describe("Offer gift for full point payment: T=Yes, F=No"),
    gift_calculation_scope: z
      .enum(["all", "benefit"])
      .optional()
      .describe("Gift calculation scope: all=All products, benefit=Benefit applied only"),
    gift_calculation_type: z
      .enum(["total_order", "actual_payment"])
      .optional()
      .describe("Gift calculation type: total_order, actual_payment"),
    include_point_usage: z
      .enum(["T", "F"])
      .optional()
      .describe("Include point usage amount: T=Include, F=Exclude"),
    include_shipping_fee: z
      .enum(["I", "E"])
      .optional()
      .describe("Include shipping fee: I=Include, E=Exclude"),
    display_soldout_gifts: z
      .enum(["grayed", "disabled"])
      .optional()
      .describe("Display soldout gifts: grayed=Show but disabled, disabled=Hide"),
    gift_grant_type: z
      .enum(["S", "A"])
      .optional()
      .describe("Gift grant type: S=Customer selection, A=Automatic"),
    gift_selection_mode: z
      .enum(["S", "M"])
      .optional()
      .describe("Gift selection mode: S=Single, M=Multiple"),
    gift_grant_mode: z
      .enum(["S", "M"])
      .optional()
      .describe("Gift grant mode: S=Single, M=Multiple"),
    gift_selection_step: z
      .array(z.enum(["order_form", "order_complete", "order_detail"]))
      .optional()
      .describe("Gift selection steps: order_form, order_complete, order_detail"),
    gift_available_condition: z
      .enum(["during_period", "after_period"])
      .optional()
      .describe("Gift availability: during_period, after_period"),
    offer_only_one_in_automatic: z
      .enum(["T", "F"])
      .optional()
      .describe("Auto gift quantity: T=Only 1, F=Based on purchase quantity"),
    allow_gift_review: z.enum(["T", "F"]).optional().describe("Allow gift review: T=Yes, F=No"),
  })
  .strict();

async function cafe24_get_benefit_setting(params: z.infer<typeof BenefitSettingParamsSchema>) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/benefits/setting", "GET", undefined, queryParams);
    const benefit = data.benefit || data;

    const useGiftText = benefit.use_gift === "T" ? "Enabled" : "Disabled";
    const paymentMethodText =
      benefit.available_payment_methods === "all"
        ? "All payments"
        : benefit.available_payment_methods === "bank_only"
          ? "Bank transfer only"
          : "Exclude bank transfer";
    const grantTypeText = benefit.gift_grant_type === "S" ? "Customer selection" : "Automatic";
    const selectionModeText = benefit.gift_selection_mode === "S" ? "Single" : "Multiple";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Benefit/Gift Settings\n\n` +
            `- **Gift Feature**: ${useGiftText}\n` +
            `- **Payment Methods**: ${paymentMethodText}\n` +
            `- **Allow Point Payment**: ${benefit.allow_point_payment === "T" ? "Yes" : "No"}\n` +
            `- **Calculation Scope**: ${benefit.gift_calculation_scope}\n` +
            `- **Calculation Type**: ${benefit.gift_calculation_type}\n` +
            `- **Include Shipping Fee**: ${benefit.include_shipping_fee === "I" ? "Yes" : "No"}\n` +
            `- **Grant Type**: ${grantTypeText}\n` +
            `- **Selection Mode**: ${selectionModeText}\n` +
            `- **Selection Steps**: ${(benefit.gift_selection_step || []).join(", ")}\n` +
            `- **Allow Gift Review**: ${benefit.allow_gift_review === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: {
        use_gift: benefit.use_gift,
        available_payment_methods: benefit.available_payment_methods,
        allow_point_payment: benefit.allow_point_payment,
        gift_calculation_scope: benefit.gift_calculation_scope,
        gift_calculation_type: benefit.gift_calculation_type,
        include_point_usage: benefit.include_point_usage,
        include_shipping_fee: benefit.include_shipping_fee,
        display_soldout_gifts: benefit.display_soldout_gifts,
        gift_grant_type: benefit.gift_grant_type,
        gift_selection_mode: benefit.gift_selection_mode,
        gift_grant_mode: benefit.gift_grant_mode,
        gift_selection_step: benefit.gift_selection_step,
        gift_available_condition: benefit.gift_available_condition,
        offer_only_one_in_automatic: benefit.offer_only_one_in_automatic,
        allow_gift_review: benefit.allow_gift_review,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_benefit_setting(
  params: z.infer<typeof BenefitSettingUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/benefits/setting", "PUT", requestBody);
    const benefit = data.benefit || data;

    const useGiftText = benefit.use_gift === "T" ? "Enabled" : "Disabled";
    const grantTypeText = benefit.gift_grant_type === "S" ? "Customer selection" : "Automatic";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Benefit/Gift Settings Updated\n\n` +
            `- **Gift Feature**: ${useGiftText}\n` +
            `- **Grant Type**: ${grantTypeText}\n` +
            `- **Selection Steps**: ${(benefit.gift_selection_step || []).join(", ")}\n`,
        },
      ],
      structuredContent: {
        use_gift: benefit.use_gift,
        available_payment_methods: benefit.available_payment_methods,
        allow_point_payment: benefit.allow_point_payment,
        gift_calculation_scope: benefit.gift_calculation_scope,
        gift_calculation_type: benefit.gift_calculation_type,
        include_shipping_fee: benefit.include_shipping_fee,
        display_soldout_gifts: benefit.display_soldout_gifts,
        gift_grant_type: benefit.gift_grant_type,
        gift_selection_mode: benefit.gift_selection_mode,
        gift_selection_step: benefit.gift_selection_step,
        gift_available_condition: benefit.gift_available_condition,
        allow_gift_review: benefit.allow_gift_review,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_benefit_setting",
    {
      title: "Get Cafe24 Benefit/Gift Settings",
      description:
        "Retrieve benefit/gift settings including gift feature enablement, payment methods, calculation scope, grant type, selection mode, and review settings.",
      inputSchema: BenefitSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_benefit_setting,
  );

  server.registerTool(
    "cafe24_update_benefit_setting",
    {
      title: "Update Cafe24 Benefit/Gift Settings",
      description:
        "Update benefit/gift settings including gift feature enablement, payment methods, calculation scope/type, grant type, selection mode/steps, and review settings.",
      inputSchema: BenefitSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_benefit_setting,
  );
}
