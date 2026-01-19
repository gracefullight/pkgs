import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

const ProductSettingParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
  })
  .strict();

const ProductSettingUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    use_adult_certification: z
      .enum(["T", "F"])
      .optional()
      .describe("Use adult certification: T=Yes, F=No"),
    use_review_board: z.enum(["T", "F"]).optional().describe("Use review board: T=Yes, F=No"),
    use_qna_board: z.enum(["T", "F"]).optional().describe("Use Q&A board: T=Yes, F=No"),
    review_board_no: z.number().int().optional().describe("Review board number"),
    qna_board_no: z.number().int().optional().describe("Q&A board number"),
    product_stock_display: z
      .enum(["A", "S", "H"])
      .optional()
      .describe("Product stock display: A=All, S=Sold out only, H=Hidden"),
    use_basket_discount: z.enum(["T", "F"]).optional().describe("Use basket discount: T=Yes, F=No"),
  })
  .strict();

async function cafe24_get_product_common_setting(
  params: z.infer<typeof ProductSettingParamsSchema>,
) {
  try {
    const queryParams: Record<string, any> = {};
    if (params.shop_no) {
      queryParams.shop_no = params.shop_no;
    }

    const data = await makeApiRequest("/admin/products/setting", "GET", undefined, queryParams);
    const product = data.product || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## General Product Settings (Shop #${product.shop_no || 1})\n\n` +
            `- **Adult Certification**: ${product.use_adult_certification === "T" ? "Enabled" : "Disabled"}\n` +
            `- **Stock Display**: ${product.product_stock_display === "A" ? "All" : product.product_stock_display === "S" ? "Sold Out Only" : "Hidden"}\n`,
        },
      ],
      structuredContent: {
        shop_no: product.shop_no ?? 1,
        use_adult_certification: product.use_adult_certification,
        use_review_board: product.use_review_board,
        use_qna_board: product.use_qna_board,
        review_board_no: product.review_board_no,
        qna_board_no: product.qna_board_no,
        product_stock_display: product.product_stock_display,
        use_basket_discount: product.use_basket_discount,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_common_setting(
  params: z.infer<typeof ProductSettingUpdateParamsSchema>,
) {
  try {
    const { shop_no, ...settings } = params;

    const requestBody: Record<string, any> = {
      shop_no: shop_no ?? 1,
      request: settings,
    };

    const data = await makeApiRequest("/admin/products/setting", "PUT", requestBody);
    const product = data.product || data;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `## General Product Settings Updated (Shop #${product.shop_no || 1})\n\n` +
            `- **Adult Certification**: ${product.use_adult_certification === "T" ? "Enabled" : "Disabled"}\n`,
        },
      ],
      structuredContent: {
        shop_no: product.shop_no ?? 1,
        use_adult_certification: product.use_adult_certification,
        use_review_board: product.use_review_board,
        use_qna_board: product.use_qna_board,
        review_board_no: product.review_board_no,
        qna_board_no: product.qna_board_no,
        product_stock_display: product.product_stock_display,
        use_basket_discount: product.use_basket_discount,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_get_product_common_setting",
    {
      title: "Get Cafe24 General Product Settings",
      description:
        "Retrieve general product settings including adult certification, board associations, and stock display options.",
      inputSchema: ProductSettingParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product_common_setting,
  );

  server.registerTool(
    "cafe24_update_product_common_setting",
    {
      title: "Update Cafe24 General Product Settings",
      description:
        "Update general product settings. Configure adult certification, review/Q&A board links, stock display visibility (All/Sold Out/Hidden), and basket discounts.",
      inputSchema: ProductSettingUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product_common_setting,
  );
}
