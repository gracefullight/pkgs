import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type GetSalesVolume, GetSalesVolumeSchema } from "@/schemas/reports.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { SalesVolumeResponse } from "@/types/index.js";

async function cafe24_get_sales_volume(params: GetSalesVolume) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<SalesVolumeResponse>(
      "/admin/reports/salesvolume",
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    const salesVolume = data.salesvolume || [];

    if (salesVolume.length === 0) {
      return {
        content: [
          { type: "text" as const, text: "No sales volume data found for the given criteria." },
        ],
        structuredContent: { salesvolume: [] },
      };
    }

    const summary = salesVolume
      .map((item) => {
        return `#### Date: ${item.collection_date} ${item.collection_hour}:00
- **Product No**: ${item.product_no}
- **Variant Code**: ${item.variants_code}
- **Price**: ${item.product_price} (Option: ${item.product_option_price})
- **Sales**: ${item.total_sales}
- **Settle Count**: ${item.settle_count}
- **Exchanged**: ${item.exchane_product_count}
- **Cancelled**: ${item.cancel_product_count}
- **Returned**: ${item.return_product_count}
- **Updated At**: ${item.updated_date}`;
      })
      .join("\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `## Sales Volume Report\n\n${summary}`,
        },
      ],
      structuredContent: { salesvolume: salesVolume },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_sales_volume",
    {
      title: "Get Sales Volume",
      description: "Retrieve sales volume reports for specific products or variants",
      inputSchema: GetSalesVolumeSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_sales_volume,
  );
}
