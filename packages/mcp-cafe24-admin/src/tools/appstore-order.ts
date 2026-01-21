import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type AppstoreOrderCreateParams,
  AppstoreOrderCreateParamsSchema,
  type AppstoreOrderDetailParams,
  AppstoreOrderDetailParamsSchema,
} from "@/schemas/appstore-order.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  AppstoreOrder,
  AppstoreOrderCreateResponse,
  AppstoreOrderGetResponse,
} from "@/types/index.js";

function formatAppstoreOrder(order: AppstoreOrder, heading: string): string {
  return (
    `${heading}${order.order_id}\n\n` +
    `- **Name**: ${order.order_name}\n` +
    `- **Amount**: ${order.order_amount} ${order.currency}\n` +
    `- **Return URL**: ${order.return_url}\n` +
    `- **Automatic Payment**: ${order.automatic_payment === "T" ? "Enabled" : "Disabled"}\n` +
    `- **Created Date**: ${order.created_date ?? "N/A"}\n` +
    `- **Confirmation URL**: ${order.confirmation_url ?? "N/A"}\n`
  );
}

async function cafe24_get_appstore_order(params: AppstoreOrderDetailParams) {
  try {
    const data = await makeApiRequest<AppstoreOrderGetResponse>(
      `/admin/appstore/orders/${params.order_id}`,
      "GET",
    );
    const order = data.order;

    return {
      content: [
        {
          type: "text" as const,
          text: formatAppstoreOrder(order, "# Appstore Order "),
        },
      ],
      structuredContent: {
        order,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_appstore_order(params: AppstoreOrderCreateParams) {
  try {
    const data = await makeApiRequest<AppstoreOrderCreateResponse>(
      "/admin/appstore/orders",
      "POST",
      {
        request: params.request,
      },
    );
    const order = data.order;

    return {
      content: [
        {
          type: "text" as const,
          text: formatAppstoreOrder(order, "# Appstore Order Created "),
        },
      ],
      structuredContent: {
        order,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_appstore_order",
    {
      title: "Get Cafe24 Appstore Order",
      description: "Retrieve an app store order by order ID.",
      inputSchema: AppstoreOrderDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_get_appstore_order,
  );

  server.registerTool(
    "cafe24_create_appstore_order",
    {
      title: "Create Cafe24 Appstore Order",
      description: "Create an app store order and return its confirmation URL.",
      inputSchema: AppstoreOrderCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_appstore_order,
  );
}
