import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import { CountProductCartsParamsSchema, ListProductCartsParamsSchema } from "../schemas/cart.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { CountProductCartsResponse, ListProductCartsResponse } from "../types/cart.js";

async function cafe24_list_product_carts(params: z.infer<typeof ListProductCartsParamsSchema>) {
  try {
    const { product_no, ...queryParams } = params;
    const data = await makeApiRequest<ListProductCartsResponse>(
      `/admin/products/${product_no}/carts`,
      "GET",
      undefined,
      queryParams,
    );
    const carts = data.carts || [];
    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${carts.length} members who have product #${product_no} in their cart\n\n` +
            carts
              .map(
                (c) =>
                  `- Member ID: ${c.member_id}\n` +
                  `  Variant: ${c.variant_code}\n` +
                  `  Quantity: ${c.quantity}\n` +
                  `  Added Date: ${c.created_date}`,
              )
              .join("\n\n"),
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

async function cafe24_count_product_carts(params: z.infer<typeof CountProductCartsParamsSchema>) {
  try {
    const { product_no, shop_no } = params;
    const data = await makeApiRequest<CountProductCartsResponse>(
      `/admin/products/${product_no}/carts/count`,
      "GET",
      undefined,
      { shop_no },
    );
    return {
      content: [
        {
          type: "text" as const,
          text: `The product #${product_no} is currently in ${data.count} shopping carts.`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_product_carts",
    {
      title: "List Product Carts",
      description: "Retrieve a list of members who have a specific product in their cart.",
      inputSchema: ListProductCartsParamsSchema,
    },
    cafe24_list_product_carts,
  );

  server.registerTool(
    "cafe24_count_product_carts",
    {
      title: "Count Product Carts",
      description: "Retrieve the number of members who have a specific product in their cart.",
      inputSchema: CountProductCartsParamsSchema,
    },
    cafe24_count_product_carts,
  );
}
