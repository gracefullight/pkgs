import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";
import {
  ProductCountParamsSchema,
  ProductCreateParamsSchema,
  ProductDeleteParamsSchema,
  ProductDetailParamsSchema,
  ProductsSearchParamsSchema,
  ProductUpdateParamsSchema,
} from "../schemas/product.js";
import { handleApiError, makeApiRequest } from "../services/api-client.js";
import type { Product } from "../types/product.js";

async function cafe24_count_products(params: z.infer<typeof ProductCountParamsSchema>) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const apiQueryParams: Record<string, unknown> = {};

    if (queryParams.product_no) apiQueryParams.product_no = queryParams.product_no;
    if (queryParams.product_code) apiQueryParams.product_code = queryParams.product_code;
    if (queryParams.custom_product_code)
      apiQueryParams.custom_product_code = queryParams.custom_product_code;
    if (queryParams.custom_variant_code)
      apiQueryParams.custom_variant_code = queryParams.custom_variant_code;
    if (queryParams.product_name) apiQueryParams.product_name = queryParams.product_name;
    if (queryParams.eng_product_name)
      apiQueryParams.eng_product_name = queryParams.eng_product_name;
    if (queryParams.supply_product_name)
      apiQueryParams.supply_product_name = queryParams.supply_product_name;
    if (queryParams.internal_product_name)
      apiQueryParams.internal_product_name = queryParams.internal_product_name;
    if (queryParams.model_name) apiQueryParams.model_name = queryParams.model_name;
    if (queryParams.product_tag) apiQueryParams.product_tag = queryParams.product_tag;
    if (queryParams.brand_code) apiQueryParams.brand_code = queryParams.brand_code;
    if (queryParams.manufacturer_code)
      apiQueryParams.manufacturer_code = queryParams.manufacturer_code;
    if (queryParams.supplier_code) apiQueryParams.supplier_code = queryParams.supplier_code;
    if (queryParams.trend_code) apiQueryParams.trend_code = queryParams.trend_code;
    if (queryParams.product_condition)
      apiQueryParams.product_condition = queryParams.product_condition;
    if (queryParams.display) apiQueryParams.display = queryParams.display;
    if (queryParams.selling) apiQueryParams.selling = queryParams.selling;
    if (queryParams.product_bundle) apiQueryParams.product_bundle = queryParams.product_bundle;
    if (queryParams.option_type) apiQueryParams.option_type = queryParams.option_type;
    if (queryParams.price_min !== undefined) apiQueryParams.price_min = queryParams.price_min;
    if (queryParams.price_max !== undefined) apiQueryParams.price_max = queryParams.price_max;
    if (queryParams.retail_price_min !== undefined)
      apiQueryParams.retail_price_min = queryParams.retail_price_min;
    if (queryParams.retail_price_max !== undefined)
      apiQueryParams.retail_price_max = queryParams.retail_price_max;
    if (queryParams.supply_price_min !== undefined)
      apiQueryParams.supply_price_min = queryParams.supply_price_min;
    if (queryParams.supply_price_max !== undefined)
      apiQueryParams.supply_price_max = queryParams.supply_price_max;
    if (queryParams.stock_quantity_min !== undefined)
      apiQueryParams.stock_quantity_min = queryParams.stock_quantity_min;
    if (queryParams.stock_quantity_max !== undefined)
      apiQueryParams.stock_quantity_max = queryParams.stock_quantity_max;
    if (queryParams.stock_safety_min !== undefined)
      apiQueryParams.stock_safety_min = queryParams.stock_safety_min;
    if (queryParams.stock_safety_max !== undefined)
      apiQueryParams.stock_safety_max = queryParams.stock_safety_max;
    if (queryParams.product_weight) apiQueryParams.product_weight = queryParams.product_weight;
    if (queryParams.created_start_date)
      apiQueryParams.created_start_date = queryParams.created_start_date;
    if (queryParams.created_end_date)
      apiQueryParams.created_end_date = queryParams.created_end_date;
    if (queryParams.updated_start_date)
      apiQueryParams.updated_start_date = queryParams.updated_start_date;
    if (queryParams.updated_end_date)
      apiQueryParams.updated_end_date = queryParams.updated_end_date;
    if (queryParams.category !== undefined) apiQueryParams.category = queryParams.category;
    if (queryParams.classification_code)
      apiQueryParams.classification_code = queryParams.classification_code;
    if (queryParams.use_inventory) apiQueryParams.use_inventory = queryParams.use_inventory;
    if (queryParams.category_unapplied)
      apiQueryParams.category_unapplied = queryParams.category_unapplied;
    if (queryParams.include_sub_category)
      apiQueryParams.include_sub_category = queryParams.include_sub_category;
    if (queryParams.additional_information_key)
      apiQueryParams.additional_information_key = queryParams.additional_information_key;
    if (queryParams.additional_information_value)
      apiQueryParams.additional_information_value = queryParams.additional_information_value;
    if (queryParams.approve_status) apiQueryParams.approve_status = queryParams.approve_status;
    if (queryParams.origin_place_value)
      apiQueryParams.origin_place_value = queryParams.origin_place_value;
    if (queryParams.market_sync) apiQueryParams.market_sync = queryParams.market_sync;
    if (queryParams.since_product_no !== undefined)
      apiQueryParams.since_product_no = queryParams.since_product_no;

    const data = await makeApiRequest<{ count: number }>(
      "/admin/products/count",
      "GET",
      undefined,
      apiQueryParams,
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${data.count} products`,
        },
      ],
      structuredContent: { count: data.count },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_products(params: z.infer<typeof ProductsSearchParamsSchema>) {
  try {
    const { shop_no, ...queryParams } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const apiQueryParams: Record<string, unknown> = {};

    if (queryParams.embed?.length) apiQueryParams.embed = queryParams.embed.join(",");
    if (queryParams.product_no) apiQueryParams.product_no = queryParams.product_no;
    if (queryParams.product_code) apiQueryParams.product_code = queryParams.product_code;
    if (queryParams.custom_product_code)
      apiQueryParams.custom_product_code = queryParams.custom_product_code;
    if (queryParams.custom_variant_code)
      apiQueryParams.custom_variant_code = queryParams.custom_variant_code;
    if (queryParams.product_name) apiQueryParams.product_name = queryParams.product_name;
    if (queryParams.eng_product_name)
      apiQueryParams.eng_product_name = queryParams.eng_product_name;
    if (queryParams.supply_product_name)
      apiQueryParams.supply_product_name = queryParams.supply_product_name;
    if (queryParams.internal_product_name)
      apiQueryParams.internal_product_name = queryParams.internal_product_name;
    if (queryParams.model_name) apiQueryParams.model_name = queryParams.model_name;
    if (queryParams.product_tag) apiQueryParams.product_tag = queryParams.product_tag;
    if (queryParams.brand_code) apiQueryParams.brand_code = queryParams.brand_code;
    if (queryParams.manufacturer_code)
      apiQueryParams.manufacturer_code = queryParams.manufacturer_code;
    if (queryParams.supplier_code) apiQueryParams.supplier_code = queryParams.supplier_code;
    if (queryParams.trend_code) apiQueryParams.trend_code = queryParams.trend_code;
    if (queryParams.product_condition)
      apiQueryParams.product_condition = queryParams.product_condition;
    if (queryParams.display) apiQueryParams.display = queryParams.display;
    if (queryParams.selling) apiQueryParams.selling = queryParams.selling;
    if (queryParams.product_bundle) apiQueryParams.product_bundle = queryParams.product_bundle;
    if (queryParams.option_type) apiQueryParams.option_type = queryParams.option_type;
    if (queryParams.price_min !== undefined) apiQueryParams.price_min = queryParams.price_min;
    if (queryParams.price_max !== undefined) apiQueryParams.price_max = queryParams.price_max;
    if (queryParams.retail_price_min !== undefined)
      apiQueryParams.retail_price_min = queryParams.retail_price_min;
    if (queryParams.retail_price_max !== undefined)
      apiQueryParams.retail_price_max = queryParams.retail_price_max;
    if (queryParams.supply_price_min !== undefined)
      apiQueryParams.supply_price_min = queryParams.supply_price_min;
    if (queryParams.supply_price_max !== undefined)
      apiQueryParams.supply_price_max = queryParams.supply_price_max;
    if (queryParams.stock_quantity_min !== undefined)
      apiQueryParams.stock_quantity_min = queryParams.stock_quantity_min;
    if (queryParams.stock_quantity_max !== undefined)
      apiQueryParams.stock_quantity_max = queryParams.stock_quantity_max;
    if (queryParams.stock_safety_min !== undefined)
      apiQueryParams.stock_safety_min = queryParams.stock_safety_min;
    if (queryParams.stock_safety_max !== undefined)
      apiQueryParams.stock_safety_max = queryParams.stock_safety_max;
    if (queryParams.product_weight) apiQueryParams.product_weight = queryParams.product_weight;
    if (queryParams.created_start_date)
      apiQueryParams.created_start_date = queryParams.created_start_date;
    if (queryParams.created_end_date)
      apiQueryParams.created_end_date = queryParams.created_end_date;
    if (queryParams.updated_start_date)
      apiQueryParams.updated_start_date = queryParams.updated_start_date;
    if (queryParams.updated_end_date)
      apiQueryParams.updated_end_date = queryParams.updated_end_date;
    if (queryParams.category !== undefined) apiQueryParams.category = queryParams.category;
    if (queryParams.classification_code)
      apiQueryParams.classification_code = queryParams.classification_code;
    if (queryParams.use_inventory) apiQueryParams.use_inventory = queryParams.use_inventory;
    if (queryParams.category_unapplied)
      apiQueryParams.category_unapplied = queryParams.category_unapplied;
    if (queryParams.include_sub_category)
      apiQueryParams.include_sub_category = queryParams.include_sub_category;
    if (queryParams.additional_information_key)
      apiQueryParams.additional_information_key = queryParams.additional_information_key;
    if (queryParams.additional_information_value)
      apiQueryParams.additional_information_value = queryParams.additional_information_value;
    if (queryParams.approve_status) apiQueryParams.approve_status = queryParams.approve_status;
    if (queryParams.origin_place_value)
      apiQueryParams.origin_place_value = queryParams.origin_place_value;
    if (queryParams.market_sync) apiQueryParams.market_sync = queryParams.market_sync;
    if (queryParams.since_product_no !== undefined)
      apiQueryParams.since_product_no = queryParams.since_product_no;
    if (queryParams.sort) apiQueryParams.sort = queryParams.sort;
    if (queryParams.order) apiQueryParams.order = queryParams.order;

    const data = await makeApiRequest<{ products: Product[]; total: number }>(
      "/admin/products",
      "GET",
      undefined,
      apiQueryParams,
      requestHeaders,
    );
    const products = data.products || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} products (showing ${products.length})\n\n` +
            products
              .map(
                (p: Product) =>
                  `## ${p.product_name} (${p.product_no})\n` +
                  `- **Code**: ${p.product_code}\n` +
                  `- **Price**: ${p.price}\n` +
                  `- **Display**: ${p.display === "T" ? "Yes" : "No"}\n` +
                  `- **Selling**: ${p.selling === "T" ? "Yes" : "No"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        count: products.length,
        offset: params.offset,
        products,
        has_more: products.length === params.limit,
        ...(products.length === params.limit
          ? { next_offset: params.offset + products.length }
          : {}),
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_product(params: z.infer<typeof ProductDetailParamsSchema>) {
  try {
    const { shop_no, product_no, embed } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const queryParams: Record<string, unknown> = {};
    if (embed?.length) queryParams.embed = embed.join(",");

    const data = await makeApiRequest<{ product: Product }>(
      `/admin/products/${product_no}`,
      "GET",
      undefined,
      queryParams,
      requestHeaders,
    );
    const product = (data.product || {}) as unknown as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Product Details\n\n` +
            `- **Product No**: ${product.product_no}\n` +
            `- **Name**: ${product.product_name}\n` +
            `- **Code**: ${product.product_code}\n` +
            `- **Price**: ${product.price}\n` +
            `- **Retail Price**: ${product.retail_price}\n` +
            `- **Supply Price**: ${product.supply_price}\n` +
            `- **Display**: ${product.display === "T" ? "Yes" : "No"}\n` +
            `- **Selling**: ${product.selling === "T" ? "Yes" : "No"}\n` +
            `- **Sold Out**: ${product.sold_out === "T" ? "Yes" : "No"}\n`,
        },
      ],
      structuredContent: product,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_product(params: z.infer<typeof ProductCreateParamsSchema>) {
  try {
    const { shop_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{ product: Product }>(
      "/admin/products",
      "POST",
      payload,
      undefined,
      requestHeaders,
    );
    const product = (data.product || {}) as unknown as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: `Product created: ${product.product_name} (No: ${product.product_no}, Code: ${product.product_code})`,
        },
      ],
      structuredContent: product,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product(params: z.infer<typeof ProductUpdateParamsSchema>) {
  try {
    const { shop_no, product_no, ...requestBody } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const payload = {
      shop_no,
      request: requestBody,
    };

    const data = await makeApiRequest<{ product: Product }>(
      `/admin/products/${product_no}`,
      "PUT",
      payload,
      undefined,
      requestHeaders,
    );
    const product = (data.product || {}) as unknown as Record<string, unknown>;

    return {
      content: [
        {
          type: "text" as const,
          text: `Product updated: ${product.product_name} (No: ${product.product_no})`,
        },
      ],
      structuredContent: product,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_product(params: z.infer<typeof ProductDeleteParamsSchema>) {
  try {
    const { shop_no, product_no } = params;
    const requestHeaders = shop_no ? { "X-Cafe24-Shop-No": shop_no.toString() } : undefined;

    const data = await makeApiRequest<{ product: { product_no: number } }>(
      `/admin/products/${product_no}`,
      "DELETE",
      undefined,
      undefined,
      requestHeaders,
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Product ${data.product?.product_no || product_no} deleted successfully`,
        },
      ],
      structuredContent: { product_no: data.product?.product_no || product_no },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_products",
    {
      title: "List Cafe24 Products",
      description:
        "Retrieve a list of products from Cafe24. Returns product details including product number, name, code, price, stock, and status. Supports extensive filtering by product number, code, category, price range, selling status, and display status. Paginated results.",
      inputSchema: ProductsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_products,
  );

  server.registerTool(
    "cafe24_count_products",
    {
      title: "Count Cafe24 Products",
      description:
        "Get the count of products matching the specified filters. Supports all product search filters.",
      inputSchema: ProductCountParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_count_products,
  );

  server.registerTool(
    "cafe24_get_product",
    {
      title: "Get Cafe24 Product Details",
      description:
        "Retrieve detailed information about a specific product by product number. Returns complete product details including name, code, price, stock, description, selling status, display status, and dates.",
      inputSchema: ProductDetailParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_product,
  );

  server.registerTool(
    "cafe24_create_product",
    {
      title: "Create Cafe24 Product",
      description:
        "Create a new product in Cafe24. Requires product name and price. Optionally includes product code, stock quantity, descriptions, selling status, and display status.",
      inputSchema: ProductCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_product,
  );

  server.registerTool(
    "cafe24_update_product",
    {
      title: "Update Cafe24 Product",
      description:
        "Update an existing product in Cafe24 by product number. Only provided fields will be updated.",
      inputSchema: ProductUpdateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_update_product,
  );

  server.registerTool(
    "cafe24_delete_product",
    {
      title: "Delete Cafe24 Product",
      description: "Delete a product from Cafe24 by product number. This action cannot be undone.",
      inputSchema: ProductDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_delete_product,
  );
}
