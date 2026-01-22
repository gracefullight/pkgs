import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CreateShippingOrigin,
  CreateShippingOriginSchema,
  type DeleteShippingOrigin,
  DeleteShippingOriginSchema,
  type ListShippingOrigins,
  ListShippingOriginsSchema,
  type RetrieveShippingOrigin,
  RetrieveShippingOriginSchema,
  type UpdateShippingOrigin,
  UpdateShippingOriginSchema,
} from "@/schemas/shipping-origin.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  CreateShippingOriginResponse,
  DeleteShippingOriginResponse,
  ListShippingOriginsResponse,
  RetrieveShippingOriginResponse,
  UpdateShippingOriginResponse,
} from "@/types/index.js";

async function cafe24_list_shipping_origins(params: ListShippingOrigins) {
  try {
    const data = await makeApiRequest<ListShippingOriginsResponse>(
      "/admin/shippingorigins",
      "GET",
      undefined,
      params as Record<string, unknown>,
    );

    const origins = data.shippingorigins || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${origins.length} shipping origins.\n\n` +
            origins
              .map(
                (o) =>
                  `- [${o.origin_code}] ${o.origin_name} (${o.zipcode})\n  Address: ${o.address1} ${o.address2}\n  Contact: ${o.contact}\n  Default: ${o.default === "T" ? "Yes" : "No"}`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { shippingorigins: origins, links: data.links },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_retrieve_shipping_origin(params: RetrieveShippingOrigin) {
  try {
    const { origin_code } = params;

    const data = await makeApiRequest<RetrieveShippingOriginResponse>(
      `/admin/shippingorigins/${origin_code}`,
      "GET",
    );

    const origin = data.shippingorigin;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Shipping Origin Detail: ${origin.origin_name} (${origin.origin_code})\n` +
            `- Zipcode: ${origin.zipcode}\n` +
            `- Country: ${origin.country_code}\n` +
            `- Address: ${origin.address1} ${origin.address2}\n` +
            `- Contact: ${origin.contact}\n` +
            `- Secondary Contact: ${origin.secondary_contact || "N/A"}\n` +
            `- Default: ${origin.default === "T" ? "Yes" : "No"}\n` +
            `- Variants: ${origin.variants?.join(", ") || "None"}`,
        },
      ],
      structuredContent: { shippingorigin: origin, links: data.links },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_shipping_origin(params: CreateShippingOrigin) {
  try {
    const data = await makeApiRequest<CreateShippingOriginResponse>(
      "/admin/shippingorigins",
      "POST",
      params,
    );

    const origin = data.shippingorigin;

    return {
      content: [
        {
          type: "text" as const,
          text: `Created shipping origin: ${origin.origin_name} (Code: ${origin.origin_code})`,
        },
      ],
      structuredContent: origin,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_shipping_origin(params: UpdateShippingOrigin) {
  try {
    const { origin_code, request } = params;

    const data = await makeApiRequest<UpdateShippingOriginResponse>(
      `/admin/shippingorigins/${origin_code}`,
      "PUT",
      { request },
    );

    const origin = data.shippingorigin;

    return {
      content: [
        {
          type: "text" as const,
          text: `Updated shipping origin: ${origin.origin_name} (Code: ${origin.origin_code})`,
        },
      ],
      structuredContent: origin,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_shipping_origin(params: DeleteShippingOrigin) {
  try {
    const { origin_code } = params;

    const data = await makeApiRequest<DeleteShippingOriginResponse>(
      `/admin/shippingorigins/${origin_code}`,
      "DELETE",
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted shipping origin: ${data.shippingorigin.origin_code}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_shipping_origins",
    {
      title: "List Shipping Origins",
      description: "Retrieve a list of shipping origins",
      inputSchema: ListShippingOriginsSchema,
    },
    cafe24_list_shipping_origins,
  );

  server.registerTool(
    "cafe24_retrieve_shipping_origin",
    {
      title: "Retrieve Shipping Origin",
      description: "Retrieve details of a single shipping origin",
      inputSchema: RetrieveShippingOriginSchema,
    },
    cafe24_retrieve_shipping_origin,
  );

  server.registerTool(
    "cafe24_create_shipping_origin",
    {
      title: "Create Shipping Origin",
      description: "Create a new shipping origin",
      inputSchema: CreateShippingOriginSchema,
    },
    cafe24_create_shipping_origin,
  );

  server.registerTool(
    "cafe24_update_shipping_origin",
    {
      title: "Update Shipping Origin",
      description: "Update an existing shipping origin",
      inputSchema: UpdateShippingOriginSchema,
    },
    cafe24_update_shipping_origin,
  );

  server.registerTool(
    "cafe24_delete_shipping_origin",
    {
      title: "Delete Shipping Origin",
      description: "Delete an existing shipping origin",
      inputSchema: DeleteShippingOriginSchema,
    },
    cafe24_delete_shipping_origin,
  );
}
