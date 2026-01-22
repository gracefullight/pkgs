import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type RetrieveShippingSetting,
  RetrieveShippingSettingSchema,
  type UpdateShippingSetting,
  UpdateShippingSettingSchema,
} from "@/schemas/shipping-setting.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  RetrieveShippingSettingResponse,
  UpdateShippingSettingResponse,
} from "@/types/index.js";

async function cafe24_retrieve_shipping_setting(params: RetrieveShippingSetting) {
  try {
    const { shop_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<RetrieveShippingSettingResponse>(
      "/admin/shipping",
      "GET",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const shipping = data.shipping;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Shipping Settings for Shop ${shipping.shop_no}\n\n` +
            `- **Method**: ${shipping.shipping_method}\n` +
            `- **Type**: ${shipping.shipping_type === "A" ? "Domestic" : shipping.shipping_type === "C" ? "International" : "Both"}\n` +
            `- **Fee Type**: ${shipping.shipping_fee_type}\n` +
            `- **Prepaid**: ${shipping.prepaid_shipping_fee}\n` +
            `- **Return Address**: ${shipping.return_address.zipcode} ${shipping.return_address.address1} ${shipping.return_address.address2}\n` +
            `- **HS Code**: ${shipping.hs_code ?? "N/A"}\n`,
        },
      ],
      structuredContent: shipping,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_shipping_setting(params: UpdateShippingSetting) {
  try {
    const { shop_no, request } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<UpdateShippingSettingResponse>(
      "/admin/shipping",
      "PUT",
      { shop_no, request },
      undefined,
      requestHeaders,
    );

    const shipping = data.shipping;

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated shipping settings for shop ${shipping.shop_no}`,
        },
      ],
      structuredContent: shipping,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_retrieve_shipping_setting",
    {
      title: "Retrieve Shipping Setting",
      description: "Retrieve general shipping settings for the store.",
      inputSchema: RetrieveShippingSettingSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_retrieve_shipping_setting,
  );

  server.registerTool(
    "cafe24_update_shipping_setting",
    {
      title: "Update Shipping Setting",
      description: "Update general shipping settings for the store.",
      inputSchema: UpdateShippingSettingSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_shipping_setting,
  );
}
