import { z } from "zod";
import { handleApiError, makeApiRequest } from "../services/api-client.js";

export const ProductsSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    product_no: z
      .string()
      .optional()
      .describe("Filter by specific product number(s), comma-separated"),
    product_code: z.string().optional().describe("Filter by product code"),
    category_no: z.number().optional().describe("Filter by category number"),
    price_min: z.number().optional().describe("Minimum price"),
    price_max: z.number().optional().describe("Maximum price"),
    selling: z
      .boolean()
      .optional()
      .describe("Filter by selling status (true=for sale, false=not for sale)"),
    display: z.boolean().optional().describe("Filter by display status"),
  })
  .strict();

export const ProductDetailParamsSchema = z
  .object({
    product_no: z.number().describe("Product number"),
  })
  .strict();

export async function cafe24_list_products(params: z.infer<typeof ProductsSearchParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/products", "GET", undefined, {
      limit: params.limit,
      offset: params.offset,
      ...(params.product_no ? { product_no: params.product_no.split(",") } : {}),
      ...(params.product_code ? { product_code: params.product_code } : {}),
      ...(params.category_no ? { category_no: params.category_no } : {}),
      ...(params.price_min !== undefined ? { price_min: params.price_min } : {}),
      ...(params.price_max !== undefined ? { price_max: params.price_max } : {}),
      ...(params.selling !== undefined ? { selling: params.selling } : {}),
      ...(params.display !== undefined ? { display: params.display } : {}),
    });

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
                (p: any) =>
                  `## ${p.product_name} (#${p.product_no})\n` +
                  `- **Product Code**: ${p.product_code || "N/A"}\n` +
                  `- **Price**: ${p.price} ${data.currency || "KRW"}\n` +
                  `- **Stock**: ${p.stock}\n` +
                  `- **Status**: ${p.selling ? "For Sale" : "Not For Sale"} | ${p.display ? "Displayed" : "Hidden"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: products.length,
        offset: params.offset,
        products: products.map((p: any) => ({
          id: p.product_no.toString(),
          name: p.product_name,
          code: p.product_code,
          price: p.price,
          stock: p.stock,
          selling: p.selling,
          display: p.display,
        })),
        has_more: total > params.offset + products.length,
        ...(total > params.offset + products.length
          ? {
              next_offset: params.offset + products.length,
            }
          : {}),
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export async function cafe24_get_product(params: z.infer<typeof ProductDetailParamsSchema>) {
  try {
    const data = await makeApiRequest(`/admin/products/${params.product_no}`, "GET");
    const product = data.product || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Product Details\n\n` +
            `- **Product No**: ${product.product_no}\n` +
            `- **Product Name**: ${product.product_name}\n` +
            `- **Product Code**: ${product.product_code || "N/A"}\n` +
            `- **Price**: ${product.price}\n` +
            `- **Stock**: ${product.stock}\n` +
            `- **Description**: ${product.summary_description || "N/A"}\n` +
            `- **Status**: ${product.selling ? "For Sale" : "Not For Sale"} | ${product.display ? "Displayed" : "Hidden"}\n`,
        },
      ],
      structuredContent: {
        id: product.product_no.toString(),
        name: product.product_name,
        code: product.product_code,
        price: product.price,
        stock: product.stock,
        selling: product.selling,
        display: product.display,
        description: product.summary_description,
        created_date: product.created_date,
        updated_date: product.updated_date,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export const ProductCreateParamsSchema = z
  .object({
    product_name: z.string().min(1).describe("Product name"),
    product_code: z.string().optional().describe("Product code"),
    price: z.number().min(0).describe("Product price"),
    stock: z.number().min(0).default(0).describe("Stock quantity"),
    summary_description: z.string().optional().describe("Short summary"),
    detail_description: z.string().optional().describe("Detailed description"),
    selling: z.boolean().optional().default(false).describe("Whether product is for sale"),
    display: z.boolean().optional().default(true).describe("Whether to display product"),
  })
  .strict();

export async function cafe24_create_product(params: z.infer<typeof ProductCreateParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/products", "POST", params);
    const product = data.product || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Product created successfully\n\n` +
            `- **Product No**: ${product.product_no}\n` +
            `- **Product Name**: ${product.product_name}\n` +
            `- **Product Code**: ${product.product_code || "N/A"}`,
        },
      ],
      structuredContent: {
        id: product.product_no.toString(),
        name: product.product_name,
        code: product.product_code,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export const ProductUpdateParamsSchema = ProductCreateParamsSchema.partial().extend({
  product_no: z.number().describe("Product number"),
});

export async function cafe24_update_product(params: z.infer<typeof ProductUpdateParamsSchema>) {
  const { product_no, ...updateParams } = params;

  try {
    const data = await makeApiRequest(`/admin/products/${product_no}`, "PUT", updateParams);
    const product = data.product || {};

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Product updated successfully\n\n` +
            `- **Product No**: ${product_no}\n` +
            `- **Product Name**: ${product.product_name}\n`,
        },
      ],
      structuredContent: {
        id: product_no.toString(),
        name: product.product_name,
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export async function cafe24_delete_product(product_no: number) {
  try {
    await makeApiRequest(`/admin/products/${product_no}`, "DELETE");
    return {
      content: [
        {
          type: "text" as const,
          text: `Product #${product_no} deleted successfully`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}

export const CategoriesSearchParamsSchema = z
  .object({
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Maximum results to return (1-100)"),
    offset: z.number().int().min(0).default(0).describe("Number of results to skip"),
    parent_category_no: z.number().optional().describe("Filter by parent category"),
  })
  .strict();

export async function cafe24_list_categories(params: z.infer<typeof CategoriesSearchParamsSchema>) {
  try {
    const data = await makeApiRequest("/admin/categories", "GET", undefined, {
      limit: params.limit,
      offset: params.offset,
      ...(params.parent_category_no ? { parent_category_no: params.parent_category_no } : {}),
    });

    const categories = data.categories || [];
    const total = data.total || 0;

    return {
      content: [
        {
          type: "text" as const,
          text:
            `Found ${total} categories (showing ${categories.length})\n\n` +
            categories
              .map(
                (c: any) =>
                  `## ${c.category_name} (Category #${c.category_no})\n` +
                  `- **Depth**: ${c.depth}\n` +
                  `- **Parent**: ${c.parent_category_no || "None"}\n`,
              )
              .join(""),
        },
      ],
      structuredContent: {
        total,
        count: categories.length,
        offset: params.offset,
        categories: categories.map((c: any) => ({
          id: c.category_no.toString(),
          name: c.category_name,
          depth: c.depth,
          parent_category_no: c.parent_category_no,
        })),
        has_more: total > params.offset + categories.length,
        ...(total > params.offset + categories.length
          ? {
              next_offset: params.offset + categories.length,
            }
          : {}),
      },
    };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: handleApiError(error) }],
    };
  }
}
