import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const ImageSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const ProductImageSizeSchema = z
  .object({
    detail_image_width: z.number().int().min(1).optional().describe("Detail image width"),
    detail_image_height: z.number().int().min(1).optional().describe("Detail image height"),
    list_image_width: z.number().int().min(1).optional().describe("List image width"),
    list_image_height: z.number().int().min(1).optional().describe("List image height"),
    tiny_image_width: z.number().int().min(1).optional().describe("Tiny/small list image width"),
    tiny_image_height: z.number().int().min(1).optional().describe("Tiny/small list image height"),
    zoom_image_width: z.number().int().min(1).optional().describe("Zoom image width"),
    zoom_image_height: z.number().int().min(1).optional().describe("Zoom image height"),
    small_image_width: z.number().int().min(1).optional().describe("Small/thumbnail image width"),
    small_image_height: z.number().int().min(1).optional().describe("Small/thumbnail image height"),
  })
  .strict();

const ImageSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    product_image_size: ProductImageSizeSchema.describe("Product image size settings"),
  })
  .strict();

async function cafe24_get_image_setting(params: z.infer<typeof ImageSettingParamsSchema>) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/images/setting", "GET", undefined, queryParams);
    const image = data.image || data;
    const sizes = image.product_image_size || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Image Settings (Shop #${image.shop_no || 1})\n\n` +
            `### Product Image Sizes\n` +
            `| Type | Width | Height |\n` +
            `|------|-------|--------|\n` +
            `| Detail | ${sizes.detail_image_width || "N/A"} | ${sizes.detail_image_height || "N/A"} |\n` +
            `| List | ${sizes.list_image_width || "N/A"} | ${sizes.list_image_height || "N/A"} |\n` +
            `| Tiny | ${sizes.tiny_image_width || "N/A"} | ${sizes.tiny_image_height || "N/A"} |\n` +
            `| Zoom | ${sizes.zoom_image_width || "N/A"} | ${sizes.zoom_image_height || "N/A"} |\n` +
            `| Small | ${sizes.small_image_width || "N/A"} | ${sizes.small_image_height || "N/A"} |\n`,
        },
      ],
      structuredContent: {
        shop_no: image.shop_no ?? 1,
        product_image_size: sizes,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_image_setting(params: z.infer<typeof ImageSettingUpdateParamsSchema>) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/images/setting", "PUT", requestBody);
    const image = data.image || data;
    const sizes = image.product_image_size || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## Image Settings Updated (Shop #${image.shop_no || 1})\n\n` +
            `- **Detail**: ${sizes.detail_image_width}x${sizes.detail_image_height}\n` +
            `- **List**: ${sizes.list_image_width}x${sizes.list_image_height}\n` +
            `- **Zoom**: ${sizes.zoom_image_width}x${sizes.zoom_image_height}\n`,
        },
      ],
      structuredContent: {
        shop_no: image.shop_no ?? 1,
        product_image_size: sizes,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_image_setting",
    {
      title: "Get Cafe24 Image Settings",
      description:
        "Retrieve product image size settings including detail, list, tiny, zoom, and small image dimensions (width and height).",
      inputSchema: ImageSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_image_setting,
  );

  server.registerTool(
    "cafe24_update_image_setting",
    {
      title: "Update Cafe24 Image Settings",
      description:
        "Update product image size settings. Includes detail, list, tiny, zoom, and small image dimensions (width and height in pixels).",
      inputSchema: ImageSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_image_setting,
  );
}
