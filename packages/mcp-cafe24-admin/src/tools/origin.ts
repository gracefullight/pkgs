import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { type ListOrigins, ListOriginsSchema } from "@/schemas/origin.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type { OriginsResponse } from "@/types/index.js";

async function cafe24_list_origins(params: ListOrigins) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<OriginsResponse>(
      "/admin/origin",
      "GET",
      undefined,
      queryParams as Record<string, unknown>,
      requestHeaders,
    );

    const origins = data.origin || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${origins.length} origin places.\n\n` +
            origins
              .map(
                (o) =>
                  `- [${o.origin_place_no}] ${o.origin_place_name.join(" > ")}\n  Foreign: ${o.foreign === "T" ? "Yes" : "No"}, Code: ${o.made_in_code ?? "N/A"}`,
              )
              .join("\n"),
        },
      ],
      structuredContent: { origins },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_origins",
    {
      title: "List Origins",
      description: "Retrieve a list of origin places",
      inputSchema: ListOriginsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_origins,
  );
}
