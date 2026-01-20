import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Theme } from "@/types/index.js";
import { type ThemesSearchParams, ThemesSearchParamsSchema } from "../schemas/theme.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

async function cafe24_list_themes(params: ThemesSearchParams) {
  try {
    const data = await makeApiRequest<{ themes: Theme[]; total: number }>(
      "/admin/themes",
      "GET",
      undefined,
      {
        limit: params.limit,
        offset: params.offset,
      },
    );

    const themes = data.themes || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} themes (showing ${themes.length})\n\n` +
            themes.map((t) => `## ${t.theme_name} (Theme #${t.theme_no})\n`).join(""),
        },
      ],
      structuredContent: {
        total,
        count: themes.length,
        offset: params.offset,
        themes: themes.map((t) => ({
          id: t.theme_no.toString(),
          name: t.theme_name,
        })),
        has_more: total > params.offset + themes.length,
        ...(total > params.offset + themes.length
          ? { next_offset: params.offset + themes.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_themes",
    {
      title: "List Cafe24 Themes",
      description:
        "Retrieve a list of themes from Cafe24. Returns theme details including theme number and name. Supports pagination.",
      inputSchema: ThemesSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_themes,
  );
}
