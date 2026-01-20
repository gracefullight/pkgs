import { z } from "zod";

export const ProductsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    embed: z
      .array(
        z.enum([
          "channeldiscountprices",
          "discountprice",
          "decorationimages",
          "benefits",
          "options",
          "variants",
          "additionalimages",
          "hits",
        ]),
      )
      .optional()
      .describe("Embed resources (options, variants, hits, etc.)"),
    product_no: z.string().optional().describe("Product number(s), comma-separated"),
    product_code: z.string().optional().describe("Product code(s), comma-separated"),
    custom_product_code: z.string().optional().describe("Custom product code(s), comma-separated"),
    custom_variant_code: z.string().optional().describe("Custom variant code(s), comma-separated"),
    product_name: z.string().optional().describe("Product name search (case-insensitive)"),
    eng_product_name: z.string().optional().describe("English product name search"),
    supply_product_name: z.string().optional().describe("Supplier product name search"),
    internal_product_name: z.string().optional().describe("Internal product name search"),
    model_name: z.string().optional().describe("Model name search"),
    product_tag: z.string().optional().describe("Product tag search, comma-separated"),
    brand_code: z.string().optional().describe("Brand code(s), comma-separated"),
    manufacturer_code: z.string().optional().describe("Manufacturer code(s), comma-separated"),
    supplier_code: z.string().optional().describe("Supplier code(s), comma-separated"),
    trend_code: z.string().optional().describe("Trend code(s), comma-separated"),
    product_condition: z
      .string()
      .optional()
      .describe(
        "Product condition (N:New, B:Return, R:Stock, U:Used, E:Display, F:Refurb, S:Scratch)",
      ),
    display: z.enum(["T", "F"]).optional().describe("Display status (T: displayed, F: hidden)"),
    selling: z.enum(["T", "F"]).optional().describe("Selling status (T: selling, F: not selling)"),
    product_bundle: z.enum(["T", "F"]).optional().describe("Bundle product (T: yes, F: no)"),
    option_type: z
      .string()
      .optional()
      .describe("Option type (C: Combined, S: Separated, E: Linked, F: Independent)"),
    price_min: z.number().optional().describe("Minimum price filter"),
    price_max: z.number().optional().describe("Maximum price filter"),
    retail_price_min: z.number().min(0).max(2147483647).optional().describe("Minimum retail price"),
    retail_price_max: z.number().min(0).max(2147483647).optional().describe("Maximum retail price"),
    supply_price_min: z.number().optional().describe("Minimum supply price"),
    supply_price_max: z.number().optional().describe("Maximum supply price"),
    stock_quantity_min: z.number().optional().describe("Minimum stock quantity"),
    stock_quantity_max: z.number().optional().describe("Maximum stock quantity"),
    stock_safety_min: z.number().optional().describe("Minimum safety stock"),
    stock_safety_max: z.number().optional().describe("Maximum safety stock"),
    product_weight: z.string().optional().describe("Product weight(s), comma-separated"),
    created_start_date: z.string().optional().describe("Created date start (YYYY-MM-DD)"),
    created_end_date: z.string().optional().describe("Created date end (YYYY-MM-DD)"),
    updated_start_date: z.string().optional().describe("Updated date start (YYYY-MM-DD)"),
    updated_end_date: z.string().optional().describe("Updated date end (YYYY-MM-DD)"),
    category: z.number().optional().describe("Category number filter"),
    classification_code: z.string().optional().describe("Classification code(s), comma-separated"),
    use_inventory: z.enum(["T", "F"]).optional().describe("Use inventory (T: yes, F: no)"),
    category_unapplied: z.enum(["T"]).optional().describe("Search uncategorized products"),
    include_sub_category: z.enum(["T"]).optional().describe("Include sub-categories"),
    additional_information_key: z.string().optional().describe("Additional info search key"),
    additional_information_value: z.string().optional().describe("Additional info search value"),
    approve_status: z
      .enum(["N", "E", "C", "R", "I"])
      .optional()
      .describe("Approval status (N:New, E:Edit, C:Approved, R:Rejected, I:Inspecting)"),
    origin_place_value: z.string().optional().describe("Origin place value, comma-separated"),
    market_sync: z.enum(["T", "F"]).optional().describe("Market sync (T: yes, F: no)"),
    since_product_no: z
      .number()
      .min(0)
      .max(2147483647)
      .optional()
      .describe("Search products after this product_no"),
    sort: z
      .enum(["created_date", "updated_date", "product_name"])
      .optional()
      .describe("Sort field"),
    order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
    offset: z.number().int().min(0).max(5000).default(0).describe("Result offset (max 5000)"),
    limit: z.number().int().min(1).max(100).default(10).describe("Result limit (1-100)"),
  })
  .strict();

export const ProductCountParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    product_no: z.string().optional().describe("Product number(s), comma-separated"),
    product_code: z.string().optional().describe("Product code(s), comma-separated"),
    custom_product_code: z.string().optional().describe("Custom product code(s), comma-separated"),
    custom_variant_code: z.string().optional().describe("Custom variant code(s), comma-separated"),
    product_name: z.string().optional().describe("Product name search (case-insensitive)"),
    eng_product_name: z.string().optional().describe("English product name search"),
    supply_product_name: z.string().optional().describe("Supplier product name search"),
    internal_product_name: z.string().optional().describe("Internal product name search"),
    model_name: z.string().optional().describe("Model name search"),
    product_tag: z.string().optional().describe("Product tag search, comma-separated"),
    brand_code: z.string().optional().describe("Brand code(s), comma-separated"),
    manufacturer_code: z.string().optional().describe("Manufacturer code(s), comma-separated"),
    supplier_code: z.string().optional().describe("Supplier code(s), comma-separated"),
    trend_code: z.string().optional().describe("Trend code(s), comma-separated"),
    product_condition: z
      .string()
      .optional()
      .describe(
        "Product condition (N:New, B:Return, R:Stock, U:Used, E:Display, F:Refurb, S:Scratch)",
      ),
    display: z.enum(["T", "F"]).optional().describe("Display status (T: displayed, F: hidden)"),
    selling: z.enum(["T", "F"]).optional().describe("Selling status (T: selling, F: not selling)"),
    product_bundle: z.enum(["T", "F"]).optional().describe("Bundle product (T: yes, F: no)"),
    option_type: z
      .string()
      .optional()
      .describe("Option type (C: Combined, S: Separated, E: Linked, F: Independent)"),
    price_min: z.number().optional().describe("Minimum price filter"),
    price_max: z.number().optional().describe("Maximum price filter"),
    retail_price_min: z.number().min(0).max(2147483647).optional().describe("Minimum retail price"),
    retail_price_max: z.number().min(0).max(2147483647).optional().describe("Maximum retail price"),
    supply_price_min: z.number().optional().describe("Minimum supply price"),
    supply_price_max: z.number().optional().describe("Maximum supply price"),
    stock_quantity_min: z.number().optional().describe("Minimum stock quantity"),
    stock_quantity_max: z.number().optional().describe("Maximum stock quantity"),
    stock_safety_min: z.number().optional().describe("Minimum safety stock"),
    stock_safety_max: z.number().optional().describe("Maximum safety stock"),
    product_weight: z.string().optional().describe("Product weight(s), comma-separated"),
    created_start_date: z.string().optional().describe("Created date start (YYYY-MM-DD)"),
    created_end_date: z.string().optional().describe("Created date end (YYYY-MM-DD)"),
    updated_start_date: z.string().optional().describe("Updated date start (YYYY-MM-DD)"),
    updated_end_date: z.string().optional().describe("Updated date end (YYYY-MM-DD)"),
    category: z.number().optional().describe("Category number filter"),
    classification_code: z.string().optional().describe("Classification code(s), comma-separated"),
    use_inventory: z.enum(["T", "F"]).optional().describe("Use inventory (T: yes, F: no)"),
    category_unapplied: z.enum(["T"]).optional().describe("Search uncategorized products"),
    include_sub_category: z.enum(["T"]).optional().describe("Include sub-categories"),
    additional_information_key: z.string().optional().describe("Additional info search key"),
    additional_information_value: z.string().optional().describe("Additional info search value"),
    approve_status: z
      .enum(["N", "E", "C", "R", "I"])
      .optional()
      .describe("Approval status (N:New, E:Edit, C:Approved, R:Rejected, I:Inspecting)"),
    origin_place_value: z.string().optional().describe("Origin place value, comma-separated"),
    market_sync: z.enum(["T", "F"]).optional().describe("Market sync (T: yes, F: no)"),
    since_product_no: z
      .number()
      .min(0)
      .max(2147483647)
      .optional()
      .describe("Search products after this product_no"),
  })
  .strict();

export const ProductDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    product_no: z.number().describe("Product number"),
    embed: z
      .array(
        z.enum([
          "variants",
          "memos",
          "hits",
          "seo",
          "tags",
          "options",
          "discountprice",
          "decorationimages",
          "benefits",
          "additionalimages",
          "custom_properties",
        ]),
      )
      .optional()
      .describe("Embed resources (variants, options, hits, memos, seo, tags, etc.)"),
  })
  .strict();

export const ProductCategorySchema = z.object({
  category_no: z.number().describe("Category number"),
  category_name: z.string().describe("Category name"),
});

export const ProductCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number"),
    supply_price: z.number().min(0).max(2147483647).optional().describe("Supply price"),
    add_category_no: z.array(ProductCategorySchema).optional().describe("Categories to add"),
  })
  .strict();

export const ProductUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    supply_price: z.number().min(0).max(2147483647).optional().describe("Supply price"),
    add_category_no: z.array(ProductCategorySchema).optional().describe("Categories to add"),
    delete_category_no: z.array(z.number().int()).optional().describe("Category numbers to delete"),
    translated_additional_description: z
      .string()
      .optional()
      .describe("Translated additional description"),
    use_icon_exposure_term: z.enum(["T", "F"]).optional().describe("Use icon exposure term"),
    icon_exposure_begin_datetime: z.string().optional().describe("Icon exposure start datetime"),
    icon_exposure_end_datetime: z.string().optional().describe("Icon exposure end datetime"),
  })
  .strict();

export const ProductDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Multi-shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export const ProductAdditionalImagesParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    additional_image: z
      .array(z.string())
      .min(1)
      .max(20)
      .describe("Additional images (base64 data URIs, max 20, 5MB each, 30MB total)"),
  })
  .strict();

export const ProductAdditionalImagesDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export const ProductApproveGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export const ProductApproveRequestParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    user_id: z.string().describe("Supplier operator ID (required)"),
  })
  .strict();

export const ProductApproveUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    user_id: z.string().describe("Supplier operator ID (required)"),
    status: z
      .enum(["C", "R", "I"])
      .describe("Approval status (C: Approved, R: Rejected, I: Inspecting)"),
  })
  .strict();

export const ProductCustomPropertiesGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export const ProductCustomPropertiesUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    property_no: z.number().describe("Custom property number (required)"),
    property_value: z.string().optional().describe("Custom property value"),
  })
  .strict();

export const ProductCustomPropertiesDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    property_no: z.number().describe("Custom property number (required)"),
  })
  .strict();

export const DecorationImageSchema = z.object({
  code: z.string().describe("Decoration image code"),
  path: z.string().optional().describe("Decoration image path"),
  image_horizontal_position: z
    .enum(["L", "C", "R"])
    .optional()
    .describe("Horizontal position (L: Left, C: Center, R: Right)"),
  image_vertical_position: z
    .enum(["T", "C", "B"])
    .optional()
    .describe("Vertical position (T: Top, C: Center, B: Bottom)"),
});

export const DecorationImagesGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export const DecorationImagesCreateUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    use_show_date: z.enum(["T", "F"]).optional().describe("Use show date period"),
    show_start_date: z.string().optional().describe("Show start date (ISO format)"),
    show_end_date: z.string().optional().describe("Show end date (ISO format)"),
    image_list: z.array(DecorationImageSchema).min(1).describe("Decoration image list"),
  })
  .strict();

export const DecorationImagesDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    code: z.string().describe("Decoration image code to delete"),
  })
  .strict();

export const ProductDiscountPriceParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export const ProductHitsCountParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export type ProductHitsCountParams = z.infer<typeof ProductHitsCountParamsSchema>;

export const ProductIconsGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export const ProductIconsCreateUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    use_show_date: z.enum(["T", "F"]).optional().describe("Use show date period"),
    show_start_date: z.string().optional().describe("Show start date (ISO format)"),
    show_end_date: z.string().optional().describe("Show end date (ISO format)"),
    image_list: z
      .array(z.object({ code: z.string().describe("Icon code") }))
      .min(1)
      .max(5)
      .describe("Icon list (max 5)"),
  })
  .strict();

export const ProductIconsDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().default(1).describe("Multi-shop number"),
    product_no: z.number().describe("Product number (required)"),
    code: z.string().describe("Icon code to delete"),
  })
  .strict();

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
