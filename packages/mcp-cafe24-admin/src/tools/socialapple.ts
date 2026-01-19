import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

// Common parameters
const SocialAppleParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const SocialAppleUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_apple_login: z
      .enum(["T", "F"])
      .optional()
      .describe("Use Apple Login: T=Enabled, F=Disabled"),
    client_id: z.string().max(300).optional().describe("Client ID (Apple Service ID Identifier)"),
    team_id: z.string().max(300).optional().describe("Team ID (Apple App ID Prefix)"),
    key_id: z.string().max(300).optional().describe("Key ID (Apple Key ID)"),
    auth_key_file_name: z
      .string()
      .max(30)
      .optional()
      .describe("Auth Key file name (e.g., .p8 file)"),
    auth_key_file_contents: z
      .string()
      .max(300)
      .optional()
      .describe("Auth Key file contents (content of .p8 file without newlines)"),
    use_certification: z
      .enum(["T", "F"])
      .optional()
      .describe("Use Apple Login Certification: T=Enabled, F=Disabled"),
  })
  .strict();

async function cafe24_get_social_apple_setting(params: z.infer<typeof SocialAppleParamsSchema>) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/socials/apple", "GET", undefined, queryParams);
    const apple = data.apple || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Social Login: Apple (Shop #${apple.shop_no || 1})\n\n` +
            `- **Status**: ${apple.use_apple_login === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Client ID**: ${apple.client_id || "N/A"}\n` +
            `- **Team ID**: ${apple.team_id || "N/A"}\n` +
            `- **Key ID**: ${apple.key_id || "N/A"}\n` +
            `- **Auth Key File**: ${apple.auth_key_file_name || "N/A"}\n` +
            `- **Certification**: ${apple.use_certification === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: apple.shop_no,
        use_apple_login: apple.use_apple_login,
        client_id: apple.client_id,
        team_id: apple.team_id,
        key_id: apple.key_id,
        auth_key_file_name: apple.auth_key_file_name,
        use_certification: apple.use_certification,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_social_apple_setting(
  params: z.infer<typeof SocialAppleUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/socials/apple", "PUT", requestBody);
    const apple = data.apple || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Social Login: Apple Updated (Shop #${apple.shop_no || 1})\n\n` +
            `- **Status**: ${apple.use_apple_login === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Client ID**: ${apple.client_id || "N/A"}\n` +
            `- **Certification**: ${apple.use_certification === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: apple.shop_no,
        use_apple_login: apple.use_apple_login,
        client_id: apple.client_id,
        team_id: apple.team_id,
        key_id: apple.key_id,
        auth_key_file_name: apple.auth_key_file_name,
        use_certification: apple.use_certification,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_social_apple_setting",
    {
      title: "Get Cafe24 Apple Social Login Settings",
      description:
        "Retrieve Apple social login configuration including Client ID, Team ID, Key ID, and certification status.",
      inputSchema: SocialAppleParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_social_apple_setting,
  );

  server.registerTool(
    "cafe24_update_social_apple_setting",
    {
      title: "Update Cafe24 Apple Social Login Settings",
      description:
        "Update Apple social login configuration. Configure Client ID, Team ID, Key ID, Auth Key file (name and content), and certification options.",
      inputSchema: SocialAppleUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_social_apple_setting,
  );
}
