import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CustomerEventCreateParams,
  CustomerEventCreateParamsSchema,
  type CustomerEventStatusUpdateParams,
  CustomerEventStatusUpdateParamsSchema,
  type CustomerEventsSearchParams,
  CustomerEventsSearchParamsSchema,
} from "@/schemas/customer-events.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  CustomerEventCreateRequest,
  CustomerEventCreateResponse,
  CustomerEventStatusUpdateRequest,
  CustomerEventStatusUpdateResponse,
  CustomerEventsListResponse,
} from "@/types/index.js";

async function cafe24_list_customer_events(params: CustomerEventsSearchParams) {
  try {
    const data = await makeApiRequest<CustomerEventsListResponse>(
      "/admin/customerevents",
      "GET",
      undefined,
      params,
    );

    const customerevents = data.customerevents || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Customer Events (${customerevents.length})\n\n` +
            (customerevents.length > 0
              ? customerevents
                  .map(
                    (event) =>
                      `## ${event.name} (No: ${event.no})\n` +
                      `- **Type**: ${event.type}\n` +
                      `- **Period**: ${event.start_date ?? "N/A"} ~ ${event.end_date ?? "N/A"}\n` +
                      `- **Created**: ${event.created_date}\n` +
                      `- **Items**: ${event.items?.join(", ") ?? "N/A"}\n` +
                      `- **Reward Condition**: ${event.reward_condition ?? "N/A"}\n` +
                      `- **Auto Reward**: ${event.auto_reward}\n` +
                      `- **Use Point**: ${event.use_point ?? "N/A"}\n` +
                      `- **Point Amount**: ${event.point_amount ?? "N/A"}\n` +
                      `- **Use Coupon**: ${event.use_coupon ?? "N/A"}\n` +
                      `- **Coupon No**: ${event.coupon_no ?? "N/A"}\n` +
                      `- **Popup Notification**: ${event.popup_notification ?? "N/A"}\n`,
                  )
                  .join("\n")
              : "No customer events found."),
        },
      ],
      structuredContent: {
        count: customerevents.length,
        customerevents,
        links: data.links,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_customer_event(params: CustomerEventCreateParams) {
  try {
    const { shop_no, request } = params;
    const requestBody: CustomerEventCreateRequest = {
      shop_no: shop_no || 1,
      request,
    };

    const data = await makeApiRequest<CustomerEventCreateResponse>(
      "/admin/customerevents",
      "POST",
      requestBody,
    );

    const event = data.customerevent;

    return {
      content: [
        {
          type: "text" as const,
          text: `Created customer event ${event.name} (No: ${event.no}).`,
        },
      ],
      structuredContent: {
        customerevent: event,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_customer_event_status(params: CustomerEventStatusUpdateParams) {
  try {
    const { shop_no, request } = params;
    const requestBody: CustomerEventStatusUpdateRequest = {
      shop_no: shop_no || 1,
      request,
    };

    const data = await makeApiRequest<CustomerEventStatusUpdateResponse>(
      "/admin/customerevents",
      "PUT",
      requestBody,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated customer event status to ${data.customerevent.status}.`,
        },
      ],
      structuredContent: {
        customerevent: data.customerevent,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_customer_events",
    {
      title: "List Cafe24 Customer Events",
      description: "Retrieve customer events with filters for name/date and pagination.",
      inputSchema: CustomerEventsSearchParamsSchema,
    },
    cafe24_list_customer_events,
  );

  server.registerTool(
    "cafe24_create_customer_event",
    {
      title: "Create Cafe24 Customer Event",
      description: "Create a customer event (member info update, password change, or lifetime).",
      inputSchema: CustomerEventCreateParamsSchema,
    },
    cafe24_create_customer_event,
  );

  server.registerTool(
    "cafe24_update_customer_event_status",
    {
      title: "Update Cafe24 Customer Event Status",
      description: "End or delete customer events by event number.",
      inputSchema: CustomerEventStatusUpdateParamsSchema,
    },
    cafe24_update_customer_event_status,
  );
}
