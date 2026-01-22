import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type ProductWishlistCustomersParams,
  ProductWishlistCustomersSchema,
} from "@/schemas/products-wishlist.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  WishlistCountResponse,
  WishlistCustomersResponse,
} from "@/types/products-wishlist.js";

async function cafe24_list_product_wishlist_customers(params: ProductWishlistCustomersParams) {
  try {
    const response = await makeApiRequest<WishlistCustomersResponse>(
      `/api/v2/admin/products/${params.product_no}/wishlist/customers`,
      "GET",
      undefined,
      { shop_no: params.shop_no },
    );

    const markdown = response.customers.length
      ? response.customers
          .map((customer) => `- Shop No: ${customer.shop_no}, Member ID: ${customer.member_id}`)
          .join("\n")
      : "No customers found in wishlist.";

    return {
      content: [
        {
          type: "text" as const,
          text: markdown,
        },
      ],
      structuredContent: response as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
    };
  }
}

async function cafe24_count_product_wishlist_customers(params: ProductWishlistCustomersParams) {
  try {
    const response = await makeApiRequest<WishlistCountResponse>(
      `/api/v2/admin/products/${params.product_no}/wishlist/customers/count`,
      "GET",
      undefined,
      { shop_no: params.shop_no },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Count: ${response.count}`,
        },
      ],
      structuredContent: response as unknown as Record<string, unknown>,
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text" as const,
          text: handleApiError(error),
        },
      ],
    };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_product_wishlist_customers",
    {
      title: "List Product Wishlist Customers",
      description: "List customers who added a product to their wishlist",
      inputSchema: ProductWishlistCustomersSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_product_wishlist_customers,
  );

  server.registerTool(
    "cafe24_count_product_wishlist_customers",
    {
      title: "Count Product Wishlist Customers",
      description: "Count customers who added a product to their wishlist",
      inputSchema: ProductWishlistCustomersSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_product_wishlist_customers,
  );
}
