import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type CategoryTranslationsSearchParams,
  CategoryTranslationsSearchParamsSchema,
  type GetThemeTranslationParams,
  GetThemeTranslationParamsSchema,
  type ProductTranslationsSearchParams,
  ProductTranslationsSearchParamsSchema,
  type StoreTranslationSearchParams,
  StoreTranslationSearchParamsSchema,
  type ThemeTranslationsSearchParams,
  ThemeTranslationsSearchParamsSchema,
  type UpdateCategoryTranslationParams,
  UpdateCategoryTranslationParamsSchema,
  type UpdateProductTranslationParams,
  UpdateProductTranslationParamsSchema,
  type UpdateStoreTranslationParams,
  UpdateStoreTranslationParamsSchema,
  type UpdateThemeTranslationParams,
  UpdateThemeTranslationParamsSchema,
} from "@/schemas/translations.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  CategoryTranslationResponse,
  CategoryTranslationsListResponse,
  ProductTranslationResponse,
  ProductTranslationsListResponse,
  StoreTranslationResponse,
  ThemeTranslationResponse,
  ThemeTranslationsListResponse,
} from "@/types/index.js";

async function cafe24_list_category_translations(params: CategoryTranslationsSearchParams) {
  try {
    const { shop_no, ...queryParams } = params;
    const data = await makeApiRequest<CategoryTranslationsListResponse>(
      "/admin/translations/categories",
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        ...queryParams,
      },
    );

    const categories = data.categories || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${categories.length} category translations.`,
        },
      ],
      structuredContent: {
        categories,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_category_translation(params: UpdateCategoryTranslationParams) {
  try {
    const { shop_no, category_no, request } = params;
    const data = await makeApiRequest<CategoryTranslationResponse>(
      `/admin/translations/categories/${category_no}`,
      "PUT",
      {
        shop_no: shop_no || 1,
        request,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Category translation updated for category #${category_no}.`,
        },
      ],
      structuredContent: {
        category: data.category,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_product_translations(params: ProductTranslationsSearchParams) {
  try {
    const { shop_no, ...queryParams } = params;
    const data = await makeApiRequest<ProductTranslationsListResponse>(
      "/admin/translations/products",
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        ...queryParams,
      },
    );

    const products = data.products || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${products.length} product translations.`,
        },
      ],
      structuredContent: {
        products,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_product_translation(params: UpdateProductTranslationParams) {
  try {
    const { shop_no, product_no, request } = params;
    const data = await makeApiRequest<ProductTranslationResponse>(
      `/admin/translations/products/${product_no}`,
      "PUT",
      {
        shop_no: shop_no || 1,
        request,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Product translation updated for product #${product_no}.`,
        },
      ],
      structuredContent: {
        product: data.product,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_store_translations(params: StoreTranslationSearchParams) {
  try {
    const { shop_no, ...queryParams } = params;
    const data = await makeApiRequest<StoreTranslationResponse>(
      "/admin/translations/store",
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        ...queryParams,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Retrieved store translations for shop #${shop_no || 1}.`,
        },
      ],
      structuredContent: {
        store: data.store,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_store_translation(params: UpdateStoreTranslationParams) {
  try {
    const { shop_no, request } = params;
    const data = await makeApiRequest<StoreTranslationResponse>(
      "/admin/translations/store",
      "PUT",
      {
        shop_no: shop_no || 1,
        request,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Store translations updated for shop #${shop_no || 1}.`,
        },
      ],
      structuredContent: {
        store: data.store,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_list_theme_translations(params: ThemeTranslationsSearchParams) {
  try {
    const { shop_no } = params;
    const data = await makeApiRequest<ThemeTranslationsListResponse>(
      "/admin/translations/themes",
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
      },
    );

    const themes = data.themes || [];

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${themes.length} themes with translation information.`,
        },
      ],
      structuredContent: {
        themes,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_get_theme_translation(params: GetThemeTranslationParams) {
  try {
    const { shop_no, skin_no, language_code } = params;
    const data = await makeApiRequest<ThemeTranslationResponse>(
      `/admin/translations/themes/${skin_no}`,
      "GET",
      undefined,
      {
        shop_no: shop_no || 1,
        language_code,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Retrieved theme translation for skin #${skin_no} (${language_code}).`,
        },
      ],
      structuredContent: {
        theme: data.theme,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_update_theme_translation(params: UpdateThemeTranslationParams) {
  try {
    const { shop_no, skin_no, request } = params;
    const data = await makeApiRequest<ThemeTranslationResponse>(
      `/admin/translations/themes/${skin_no}`,
      "PUT",
      {
        shop_no: shop_no || 1,
        request,
      },
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Theme translation updated for skin #${skin_no}.`,
        },
      ],
      structuredContent: {
        theme: data.theme,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_category_translations",
    {
      title: "List Cafe24 Category Translations",
      description: "Retrieve translation information for product categories from Cafe24.",
      inputSchema: CategoryTranslationsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_category_translations,
  );

  server.registerTool(
    "cafe24_update_category_translation",
    {
      title: "Update Cafe24 Category Translation",
      description: "Update translation information for a specific product category in Cafe24.",
      inputSchema: UpdateCategoryTranslationParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_category_translation,
  );

  server.registerTool(
    "cafe24_list_product_translations",
    {
      title: "List Cafe24 Product Translations",
      description: "Retrieve translation information for products from Cafe24.",
      inputSchema: ProductTranslationsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_product_translations,
  );

  server.registerTool(
    "cafe24_update_product_translation",
    {
      title: "Update Cafe24 Product Translation",
      description: "Update translation information for a specific product in Cafe24.",
      inputSchema: UpdateProductTranslationParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_product_translation,
  );

  server.registerTool(
    "cafe24_get_store_translations",
    {
      title: "Get Cafe24 Store Translations",
      description: "Retrieve translation information for the store from Cafe24.",
      inputSchema: StoreTranslationSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_store_translations,
  );

  server.registerTool(
    "cafe24_update_store_translation",
    {
      title: "Update Cafe24 Store Translation",
      description: "Update translation information for the store in Cafe24.",
      inputSchema: UpdateStoreTranslationParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_store_translation,
  );

  server.registerTool(
    "cafe24_list_theme_translations",
    {
      title: "List Cafe24 Theme Translations",
      description: "Retrieve translation information for themes from Cafe24.",
      inputSchema: ThemeTranslationsSearchParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_list_theme_translations,
  );

  server.registerTool(
    "cafe24_get_theme_translation",
    {
      title: "Get Cafe24 Theme Translation",
      description: "Retrieve translation information for a specific theme in Cafe24.",
      inputSchema: GetThemeTranslationParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    cafe24_get_theme_translation,
  );

  server.registerTool(
    "cafe24_update_theme_translation",
    {
      title: "Update Cafe24 Theme Translation",
      description: "Update translation information for a specific theme in Cafe24.",
      inputSchema: UpdateThemeTranslationParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    cafe24_update_theme_translation,
  );
}
