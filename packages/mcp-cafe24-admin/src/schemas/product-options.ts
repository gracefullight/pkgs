import { z } from "zod";

/**
 * Option value schema for creating/updating options
 */
const OptionValueSchema = z.object({
  option_image_file: z.string().optional().describe("Option image file URL"),
  option_link_image: z.string().optional().describe("Option link image URL"),
  option_color: z.string().optional().describe("Option color code (e.g., #000000)"),
  option_text: z.string().describe("Option text value"),
});

/**
 * Option schema for creating options
 */
const OptionCreateSchema = z.object({
  option_name: z.string().describe("Option name (required)"),
  option_value: z.array(OptionValueSchema).describe("Option values array"),
  option_display_type: z
    .enum(["S", "P", "B", "R"])
    .optional()
    .default("S")
    .describe("Option display type (S: select box, P: preview, B: text swatch, R: radio button)"),
});

/**
 * Additional option schema
 */
const AdditionalOptionSchema = z.object({
  additional_option_name: z.string().describe("Additional option name"),
  required_additional_option: z
    .enum(["T", "F"])
    .describe("Whether additional option is required (T: Yes, F: No)"),
  additional_option_text_length: z.number().int().describe("Additional option text max length"),
});

/**
 * Attached file option schema
 */
const AttachedFileOptionSchema = z.object({
  option_name: z.string().describe("Attached file option name"),
  required: z.enum(["T", "F"]).describe("Whether attached file is required (T: Yes, F: No)"),
  size_limit: z.number().int().describe("File size limit in MB"),
});

/**
 * Schema for getting product options
 */
export const ProductOptionsGetParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export type ProductOptionsGetParams = z.infer<typeof ProductOptionsGetParamsSchema>;

/**
 * Schema for creating product options
 */
export const ProductOptionsCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    has_option: z.enum(["T", "F"]).describe("Whether option is used (T: Use, F: Do not use)"),
    option_type: z
      .enum(["T", "E", "F"])
      .optional()
      .describe(
        "Option type (T: Combination, E: Linked with product, F: Independently selectable)",
      ),
    option_list_type: z
      .enum(["S", "C"])
      .optional()
      .describe("Option list type (S: Separated, C: Integrated)"),
    options: z.array(OptionCreateSchema).optional().describe("Options array"),
    select_one_by_option: z
      .enum(["T", "F"])
      .optional()
      .describe(
        "Select only one by option (T: Use, F: Do not use) - Only for independently selectable type",
      ),
    option_preset_code: z
      .string()
      .regex(/^[A-Z0-9]{8}$/)
      .optional()
      .describe("Option preset code (8 characters, A-Z0-9)"),
    option_preset_name: z.string().optional().describe("Option preset name"),
    use_additional_option: z
      .enum(["T", "F"])
      .optional()
      .describe("Whether to use additional option (T: Use, F: Do not use)"),
    additional_options: z
      .array(AdditionalOptionSchema)
      .optional()
      .describe("Additional options array"),
    use_attached_file_option: z
      .enum(["T", "F"])
      .optional()
      .describe("Whether to use attached file option (T: Use, F: Do not use)"),
    attached_file_option: AttachedFileOptionSchema.optional().describe(
      "Attached file option settings",
    ),
  })
  .strict();

export type ProductOptionsCreateParams = z.infer<typeof ProductOptionsCreateParamsSchema>;

/**
 * Original option value schema for updating
 */
const OriginalOptionValueSchema = z.object({
  option_text: z.string().describe("Original option text value"),
});

/**
 * Original option schema for updating
 */
const OriginalOptionSchema = z.object({
  option_name: z.string().describe("Original option name"),
  option_value: z.array(OriginalOptionValueSchema).describe("Original option values"),
});

/**
 * Schema for updating product options
 */
export const ProductOptionsUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
    option_list_type: z
      .enum(["S", "C"])
      .optional()
      .describe("Option list type (S: Separated, C: Integrated)"),
    original_options: z
      .array(OriginalOptionSchema)
      .optional()
      .describe("Original options before modification"),
    options: z.array(OptionCreateSchema).optional().describe("New/updated options array"),
    select_one_by_option: z
      .enum(["T", "F"])
      .optional()
      .describe("Select only one by option (T: Use, F: Do not use)"),
    option_preset_code: z
      .string()
      .regex(/^[A-Z0-9]{8}$/)
      .optional()
      .describe("Option preset code (8 characters, A-Z0-9)"),
    option_preset_name: z.string().optional().describe("Option preset name"),
    use_additional_option: z
      .enum(["T", "F"])
      .optional()
      .describe("Whether to use additional option (T: Use, F: Do not use)"),
    additional_options: z
      .array(AdditionalOptionSchema)
      .optional()
      .describe("Additional options array"),
    use_attached_file_option: z
      .enum(["T", "F"])
      .optional()
      .describe("Whether to use attached file option (T: Use, F: Do not use)"),
    attached_file_option: AttachedFileOptionSchema.optional().describe(
      "Attached file option settings",
    ),
  })
  .strict();

export type ProductOptionsUpdateParams = z.infer<typeof ProductOptionsUpdateParamsSchema>;

/**
 * Schema for deleting product options
 */
export const ProductOptionsDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).optional().describe("Shop number (default: 1)"),
    product_no: z.number().describe("Product number (required)"),
  })
  .strict();

export type ProductOptionsDeleteParams = z.infer<typeof ProductOptionsDeleteParamsSchema>;
