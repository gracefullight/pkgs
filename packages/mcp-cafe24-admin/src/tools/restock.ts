import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const RestockNotificationParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const RestockNotificationUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use: z.enum(["T", "F"]).optional().describe("Use restock notification: T=Yes, F=No"),
    is_button_show: z.enum(["T", "F"]).optional().describe("Show button: T=Yes, F=No"),
    expiration_period: z
      .union([z.literal(1), z.literal(3), z.literal(6), z.literal(12)])
      .optional()
      .describe("Expiration period (months): 1, 3, 6, 12"),
    button_show_target: z
      .enum(["A", "M"])
      .optional()
      .describe("Button show target: A=All, M=Members only"),
    show_message_to_non_members: z
      .string()
      .max(30)
      .optional()
      .describe("Message for non-members (max 30 chars)"),
    send_method: z.enum(["A", "M"]).optional().describe("Send method: A=Auto, M=Manual"),
    button_show_method: z
      .enum(["P", "G"])
      .optional()
      .describe("Button display type: P=By Product, G=By Item"),
    available_product: z
      .enum(["A", "P", "E"])
      .optional()
      .describe("Available products: A=All, P=Selected, E=Excluded"),
    available_product_list: z
      .array(z.number().int())
      .max(200)
      .optional()
      .describe("List of product IDs for available/excluded products"),
  })
  .strict();

async function cafe24_get_restock_notification_setting(
  params: z.infer<typeof RestockNotificationParamsSchema>,
) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest(
      "/admin/restocknotification/setting",
      "GET",
      undefined,
      queryParams,
    );
    const setting = data.restocknotification || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Restock Notification Settings (Shop #${setting.shop_no || 1})\n\n` +
            `- **Enabled**: ${setting.use === "T" ? "Yes" : "No"}\n` +
            `- **Show Button**: ${setting.is_button_show === "T" ? "Yes" : "No"}\n` +
            `- **Expiration**: ${setting.expiration_period} months\n` +
            `- **Target**: ${setting.button_show_target === "A" ? "All Users" : "Members Only"}\n` +
            `- **Send Method**: ${setting.send_method === "A" ? "Auto" : "Manual"}\n` +
            `- **Display Type**: ${setting.button_show_method === "P" ? "By Product" : "By Item"}\n` +
            `- **Product Scope**: ${
              setting.available_product === "A"
                ? "All"
                : setting.available_product === "P"
                  ? "Selected"
                  : "Excluded"
            }\n`,
        },
      ],
      structuredContent: {
        shop_no: setting.shop_no ?? 1,
        use: setting.use,
        is_button_show: setting.is_button_show,
        expiration_period: setting.expiration_period,
        button_show_target: setting.button_show_target,
        show_message_to_non_members: setting.show_message_to_non_members,
        send_method: setting.send_method,
        button_show_method: setting.button_show_method,
        available_product: setting.available_product,
        available_product_list: setting.available_product_list,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_restock_notification_setting(
  params: z.infer<typeof RestockNotificationUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/restocknotification/setting", "PUT", requestBody);
    const setting = data.restocknotification || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Restock Notification Settings Updated (Shop #${setting.shop_no || 1})\n\n` +
            `- **Enabled**: ${setting.use === "T" ? "Yes" : "No"}\n` +
            `- **Show Button**: ${setting.is_button_show === "T" ? "Yes" : "No"}\n` +
            `- **Send Method**: ${setting.send_method === "A" ? "Auto" : "Manual"}\n`,
        },
      ],
      structuredContent: {
        shop_no: setting.shop_no ?? 1,
        use: setting.use,
        is_button_show: setting.is_button_show,
        expiration_period: setting.expiration_period,
        button_show_target: setting.button_show_target,
        show_message_to_non_members: setting.show_message_to_non_members,
        send_method: setting.send_method,
        button_show_method: setting.button_show_method,
        available_product: setting.available_product,
        available_product_list: setting.available_product_list,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_restock_notification_setting",
    {
      title: "Get Cafe24 Restock Notification Settings",
      description:
        "Retrieve restock notification settings including button visibility, expiration period, target audience, and send method.",
      inputSchema: RestockNotificationParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_restock_notification_setting,
  );

  server.registerTool(
    "cafe24_update_restock_notification_setting",
    {
      title: "Update Cafe24 Restock Notification Settings",
      description:
        "Update restock notification settings. Configure usage, button display/target, expiration period, send method (Auto/Manual), and product scope.",
      inputSchema: RestockNotificationUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_restock_notification_setting,
  );
}
