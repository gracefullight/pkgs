import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type ListAdditionalFees,
  ListAdditionalFeesSchema,
} from "@/schemas/shipping-additional-fees.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { AdditionalFeesResponse } from "@/types/index.js";

async function cafe24_list_shipping_additional_fees(params: ListAdditionalFees) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<AdditionalFeesResponse>(
      "/admin/shipping/additionalfees",
      "GET",
      undefined,
      { shop_no, ...queryParams },
      requestHeaders,
    );

    const fees = data.additionalfees || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `### Additional Shipping Fees (Shop #${shop_no})\n\n` +
            (fees.length > 0
              ? fees
                  .map(
                    (f) =>
                      `#### ${f.fee_name} (${f.country_code})\n` +
                      `- **Range**: ${f.min_value} ~ ${f.max_value}\n` +
                      `- **Fee**: ${f.additional_fee} (${f.unit === "W" ? "Fixed" : "Percentage"})\n` +
                      `- **Rounding**: ${f.rounding_unit} (Unit), ${f.rounding_rule === "L" ? "Floor" : f.rounding_rule === "U" ? "Round" : "Ceil"} (Rule)`,
                  )
                  .join("\n\n")
              : "No additional shipping fees found."),
        },
      ],
      structuredContent: { fees },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_shipping_additional_fees",
    {
      title: "List Additional Shipping Fees",
      description: "Retrieve a list of additional handling fees for international shipping",
      inputSchema: ListAdditionalFeesSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_shipping_additional_fees,
  );
}
