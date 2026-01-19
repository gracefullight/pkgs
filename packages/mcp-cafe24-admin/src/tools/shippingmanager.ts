import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const ShippingManagerParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

async function cafe24_get_shippingmanager_status(
  params: z.infer<typeof ShippingManagerParamsSchema>,
) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/shippingmanager", "GET", undefined, queryParams);
    const status = data.shippingmanager || {};

    return {
      content: [
        {
          type: "text" as const,
          text: `Shipping Manager Status: ${status.use === "T" ? "Enabled" : "Disabled"}`,
        },
      ],
      structuredContent: {
        use: status.use,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_shippingmanager_status",
    {
      title: "Get Cafe24 Shipping Manager Status",
      description: "Retrieve the activation status of the Shipping Manager service.",
      inputSchema: ShippingManagerParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_shippingmanager_status,
  );
}
