import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type GetRegionalSurcharge,
  GetRegionalSurchargeSchema,
  type UpdateRegionalSurcharge,
  UpdateRegionalSurchargeSchema,
} from "@/schemas/regional-surcharges.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { RegionalSurchargeResponse } from "@/types/index.js";

async function cafe24_get_regional_surcharges(params: GetRegionalSurcharge) {
  try {
    const { shop_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<RegionalSurchargeResponse>(
      "/admin/regionalsurcharges",
      "GET",
      undefined,
      { shop_no },
      requestHeaders,
    );

    const rs = data.regionalsurcharge;

    const listText = rs.regional_surcharge_list
      ? `\n### Regional Surcharge List\n` +
        rs.regional_surcharge_list
          .map(
            (item) =>
              `- **${item.region_name}** (${item.start_zipcode} ~ ${item.end_zipcode}): ${item.regional_surcharge_amount}`,
          )
          .join("\n")
      : "";

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Regional Surcharge Settings (Shop #${rs.shop_no})\n\n` +
            `- **Enabled**: ${rs.use_regional_surcharge === "T" ? "Yes" : "No"}\n` +
            `- **Setting Type**: ${rs.region_setting_type === "A" ? "Quick" : rs.region_setting_type === "N" ? "Area Name" : "Postal Code"}\n` +
            `- **Jeju Surcharge**: ${rs.jeju_surcharge_amount ?? "N/A"}\n` +
            `- **Remote Area Surcharge**: ${rs.remote_area_surcharge_amount ?? "N/A"}\n` +
            listText,
        },
      ],
      structuredContent: rs,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_regional_surcharges(params: UpdateRegionalSurcharge) {
  try {
    const { shop_no, request } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<RegionalSurchargeResponse>(
      "/admin/regionalsurcharges",
      "PUT",
      { shop_no, request },
      undefined,
      requestHeaders,
    );

    const rs = data.regionalsurcharge;

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated regional surcharge settings for shop #${rs.shop_no}.`,
        },
      ],
      structuredContent: rs,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_regional_surcharges",
    {
      title: "Get Regional Surcharges",
      description: "Retrieve regional surcharge settings for the mall",
      inputSchema: GetRegionalSurchargeSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_regional_surcharges,
  );

  server.registerTool(
    "cafe24_update_regional_surcharges",
    {
      title: "Update Regional Surcharges",
      description:
        "Update regional surcharge settings for " +
        "the mall (Jeju, remote areas, and setting type)",
      inputSchema: UpdateRegionalSurchargeSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_regional_surcharges,
  );
}
