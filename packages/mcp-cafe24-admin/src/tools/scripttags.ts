import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type ScripttagCreateParams,
  ScripttagCreateParamsSchema,
  type ScripttagDeleteParams,
  ScripttagDeleteParamsSchema,
  type ScripttagDetailParams,
  ScripttagDetailParamsSchema,
  type ScripttagsCountParams,
  ScripttagsCountParamsSchema,
  type ScripttagsSearchParams,
  ScripttagsSearchParamsSchema,
  type ScripttagUpdateParams,
  ScripttagUpdateParamsSchema,
} from "@/schemas/scripttags.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  Scripttag,
  ScripttagCreateRequest,
  ScripttagDeleteResponse,
  ScripttagResponse,
  ScripttagsCountResponse,
  ScripttagsListResponse,
  ScripttagUpdateRequest,
} from "@/types/index.js";

function formatScripttag(tag: Scripttag): string {
  const displayLocations = tag.display_location?.length ? tag.display_location.join(", ") : "N/A";
  const excludePaths = tag.exclude_path?.length ? tag.exclude_path.join(", ") : "N/A";
  const skinNumbers = tag.skin_no?.length ? tag.skin_no.join(", ") : "N/A";

  return (
    `## Script ${tag.script_no}\n` +
    `- **Src**: ${tag.src}\n` +
    `- **Client ID**: ${tag.client_id}\n` +
    `- **Display Locations**: ${displayLocations}\n` +
    `- **Excluded Paths**: ${excludePaths}\n` +
    `- **Skin Numbers**: ${skinNumbers}\n` +
    `- **Integrity**: ${tag.integrity ?? "N/A"}\n` +
    `- **Created**: ${tag.created_date ?? "N/A"}\n` +
    `- **Updated**: ${tag.updated_date ?? "N/A"}\n`
  );
}

async function cafe24_list_scripttags(params: ScripttagsSearchParams) {
  try {
    const { shop_no, ...queryParams } = params;
    const data = await makeApiRequest<ScripttagsListResponse>(
      "/admin/scripttags",
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        ...queryParams,
      },
    );

    const scripttags = data.scripttags || [];

    return {
      content: [
        {
          type: "text" as const,
          text:
            `# Script Tags (${scripttags.length})\n\n` +
            (scripttags.length > 0
              ? scripttags.map(formatScripttag).join("\n")
              : "No script tags found."),
        },
      ],
      structuredContent: {
        scripttags,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_count_scripttags(params: ScripttagsCountParams) {
  try {
    const data = await makeApiRequest<ScripttagsCountResponse>(
      "/admin/scripttags/count",
      "GET",
      undefined,
      params,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Total script tag count: ${data.count}`,
        },
      ],
      structuredContent: data as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_scripttag(params: ScripttagDetailParams) {
  try {
    const { shop_no, script_no } = params;
    const data = await makeApiRequest<ScripttagResponse>(
      `/admin/scripttags/${script_no}`,
      "GET",
      undefined,
      { shop_no: shop_no || 1 },
    );

    const tag = data.scripttag;

    return {
      content: [
        {
          type: "text" as const,
          text: `# Script Tag ${tag.script_no}\n\n${formatScripttag(tag)}`,
        },
      ],
      structuredContent: {
        scripttag: tag,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_scripttag(params: ScripttagCreateParams) {
  try {
    const { shop_no, request } = params;
    const requestBody: ScripttagCreateRequest = {
      shop_no: shop_no || 1,
      request,
    };

    const data = await makeApiRequest<ScripttagResponse>("/admin/scripttags", "POST", requestBody);

    return {
      content: [
        {
          type: "text" as const,
          text: `Script tag created: ${data.scripttag.script_no}`,
        },
      ],
      structuredContent: {
        scripttag: data.scripttag,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_scripttag(params: ScripttagUpdateParams) {
  try {
    const { shop_no, script_no, request } = params;
    const requestBody: ScripttagUpdateRequest = {
      shop_no: shop_no || 1,
      request,
    };

    const data = await makeApiRequest<ScripttagResponse>(
      `/admin/scripttags/${script_no}`,
      "PUT",
      requestBody,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Script tag updated: ${data.scripttag.script_no}`,
        },
      ],
      structuredContent: {
        scripttag: data.scripttag,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_scripttag(params: ScripttagDeleteParams) {
  try {
    const { shop_no, script_no } = params;
    const data = await makeApiRequest<ScripttagDeleteResponse>(
      `/admin/scripttags/${script_no}`,
      "DELETE",
      undefined,
      { shop_no: shop_no || 1 },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Script tag deleted: ${data.scripttag.script_no}`,
        },
      ],
      structuredContent: {
        scripttag: data.scripttag,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_scripttags",
    {
      title: "List Cafe24 Script Tags",
      description: "Retrieve script tags with optional filters.",
      inputSchema: ScripttagsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_scripttags,
  );

  server.registerTool(
    "cafe24_count_scripttags",
    {
      title: "Count Cafe24 Script Tags",
      description: "Retrieve the count of script tags matching the filters.",
      inputSchema: ScripttagsCountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_scripttags,
  );

  server.registerTool(
    "cafe24_get_scripttag",
    {
      title: "Get Cafe24 Script Tag",
      description: "Retrieve a script tag by its script number.",
      inputSchema: ScripttagDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_scripttag,
  );

  server.registerTool(
    "cafe24_create_scripttag",
    {
      title: "Create Cafe24 Script Tag",
      description: "Create a new script tag and attach it to display locations.",
      inputSchema: ScripttagCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_scripttag,
  );

  server.registerTool(
    "cafe24_update_scripttag",
    {
      title: "Update Cafe24 Script Tag",
      description: "Update an existing script tag.",
      inputSchema: ScripttagUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_scripttag,
  );

  server.registerTool(
    "cafe24_delete_scripttag",
    {
      title: "Delete Cafe24 Script Tag",
      description: "Delete a script tag by its script number.",
      inputSchema: ScripttagDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_scripttag,
  );
}
