import { z } from "zod";

export const CategoryTranslationsSearchParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).optional(),
  category_no: z.string().optional().describe("Category number(s) separated by comma"),
  language_code: z.string().optional().describe("Language code(s) separated by comma"),
  offset: z.number().int().min(0).max(8000).default(0).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
});

export type CategoryTranslationsSearchParams = z.infer<
  typeof CategoryTranslationsSearchParamsSchema
>;

export const UpdateCategoryTranslationParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).optional(),
  category_no: z.number().int().describe("Category number"),
  request: z.object({
    translations: z.array(
      z.object({
        language_code: z.string().describe("Language code (e.g., en_US, es_ES)"),
        category_name: z.string().optional(),
        seo: z
          .object({
            meta_title: z.string().optional(),
            meta_author: z.string().optional(),
            meta_description: z.string().optional(),
            meta_keywords: z.string().optional(),
          })
          .optional(),
      }),
    ),
  }),
});

export type UpdateCategoryTranslationParams = z.infer<typeof UpdateCategoryTranslationParamsSchema>;

export const ProductTranslationsSearchParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).optional(),
  product_no: z.string().optional().describe("Product number(s) separated by comma"),
  product_name: z.string().optional().describe("Product name"),
  language_code: z.string().optional().describe("Language code(s) separated by comma"),
  offset: z.number().int().min(0).max(8000).default(0).optional(),
  limit: z.number().int().min(1).max(100).default(10).optional(),
});

export type ProductTranslationsSearchParams = z.infer<typeof ProductTranslationsSearchParamsSchema>;

export const UpdateProductTranslationParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).optional(),
  product_no: z.number().int().describe("Product number"),
  request: z.object({
    translations: z.array(
      z.object({
        language_code: z.string().describe("Language code (e.g., en_US, es_ES)"),
        product_name: z.string().optional(),
        product_tag: z.string().optional(),
        payment_info: z.string().optional(),
        shipping_info: z.string().optional(),
        exchange_info: z.string().optional(),
        service_info: z.string().optional(),
        summary_description: z.string().optional(),
        simple_description: z.string().optional(),
        description: z.string().optional(),
        mobile_description: z.string().optional(),
        product_material: z.string().optional(),
        seo: z
          .object({
            meta_title: z.string().optional(),
            meta_author: z.string().optional(),
            meta_description: z.string().optional(),
            meta_keywords: z.string().optional(),
            meta_alt: z.string().optional(),
          })
          .optional(),
        options: z
          .array(
            z.object({
              name: z.string(),
              value: z.array(z.string()),
            }),
          )
          .optional(),
      }),
    ),
  }),
});

export type UpdateProductTranslationParams = z.infer<typeof UpdateProductTranslationParamsSchema>;

export const StoreTranslationSearchParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).optional(),
  language_code: z.string().optional().describe("Language code(s) separated by comma"),
});

export type StoreTranslationSearchParams = z.infer<typeof StoreTranslationSearchParamsSchema>;

export const UpdateStoreTranslationParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).optional(),
  request: z.object({
    translations: z.array(
      z.object({
        language_code: z.string().describe("Language code (e.g., en_US, es_ES)"),
        shop_name: z.string().optional(),
        company_name: z.string().optional(),
        company_registration_no: z.string().optional(),
        president_name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        fax: z.string().optional(),
        zipcode: z.string().optional(),
        address1: z.string().optional(),
        address2: z.string().optional(),
        customer_service_phone: z.string().optional(),
        customer_service_hours: z.string().optional(),
        privacy_officer_name: z.string().optional(),
        privacy_officer_email: z.string().optional(),
      }),
    ),
  }),
});

export type UpdateStoreTranslationParams = z.infer<typeof UpdateStoreTranslationParamsSchema>;

export const ThemeTranslationsSearchParamsSchema = z.object({
  shop_no: z.number().int().min(1).default(1).optional(),
});

export type ThemeTranslationsSearchParams = z.infer<typeof ThemeTranslationsSearchParamsSchema>;

export const GetThemeTranslationParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).optional(),
    skin_no: z.number().int().describe("Skin number"),
    language_code: z.string().describe("Language code (e.g., en_US, es_ES)"),
  })
  .strict();

export type GetThemeTranslationParams = z.infer<typeof GetThemeTranslationParamsSchema>;

export const UpdateThemeTranslationParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).optional(),
    skin_no: z.number().int().describe("Skin number"),
    request: z.object({
      skin_translation: z.object({
        language_code: z.string().describe("Language code (e.g., en_US, es_ES)"),
        source: z.string().describe("The translation source code in JSON format"),
      }),
    }),
  })
  .strict();

export type UpdateThemeTranslationParams = z.infer<typeof UpdateThemeTranslationParamsSchema>;
