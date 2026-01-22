import { z } from "zod";

export const ScripttagsSearchParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    script_no: z.string().optional().describe("Script number"),
    src: z.string().optional().describe("Original script path"),
    display_location: z.string().optional().describe("Display location (screen path)"),
    display_location_code: z
      .string()
      .optional()
      .describe("Display location code(s), comma-separated"),
    exclude_path: z.string().optional().describe("Excluded path(s), comma-separated"),
    skin_no: z.string().optional().describe("Skin number(s), comma-separated"),
    integrity: z.string().optional().describe("Subresource integrity hash"),
    created_start_date: z
      .string()
      .optional()
      .describe("Search start date for creation time (YYYY-MM-DD or ISO 8601)"),
    created_end_date: z
      .string()
      .optional()
      .describe("Search end date for creation time (YYYY-MM-DD or ISO 8601)"),
    updated_start_date: z
      .string()
      .optional()
      .describe("Search start date for update time (YYYY-MM-DD or ISO 8601)"),
    updated_end_date: z
      .string()
      .optional()
      .describe("Search end date for update time (YYYY-MM-DD or ISO 8601)"),
  })
  .strict();

export const ScripttagsCountParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    script_no: z.string().optional().describe("Script number"),
    src: z.string().optional().describe("Original script path"),
    display_location: z.string().optional().describe("Display location (screen path)"),
    display_location_code: z
      .string()
      .optional()
      .describe("Display location code(s), comma-separated"),
    skin_no: z.string().optional().describe("Skin number(s), comma-separated"),
    created_start_date: z
      .string()
      .optional()
      .describe("Search start date for creation time (YYYY-MM-DD or ISO 8601)"),
    created_end_date: z
      .string()
      .optional()
      .describe("Search end date for creation time (YYYY-MM-DD or ISO 8601)"),
    updated_start_date: z
      .string()
      .optional()
      .describe("Search start date for update time (YYYY-MM-DD or ISO 8601)"),
    updated_end_date: z
      .string()
      .optional()
      .describe("Search end date for update time (YYYY-MM-DD or ISO 8601)"),
  })
  .strict();

export const ScripttagDetailParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    script_no: z.string().min(1).describe("Script number"),
  })
  .strict();

export const ScripttagCreateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    request: z
      .object({
        src: z.string().min(1).describe("Original script path"),
        display_location: z
          .array(z.string().min(1))
          .min(1)
          .describe("Display locations to apply the script"),
        exclude_path: z
          .array(z.string().min(1))
          .optional()
          .nullable()
          .describe("Excluded path list"),
        skin_no: z.array(z.number().int()).optional().nullable().describe("Skin number list"),
        integrity: z.string().optional().describe("Subresource integrity hash"),
      })
      .strict()
      .describe("Scripttag creation payload"),
  })
  .strict();

export const ScripttagUpdateParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    script_no: z.string().min(1).describe("Script number"),
    request: z
      .object({
        src: z.string().min(1).optional().describe("Original script path"),
        display_location: z
          .array(z.string().min(1))
          .optional()
          .describe("Display locations to apply the script"),
        exclude_path: z
          .array(z.string().min(1))
          .optional()
          .nullable()
          .describe("Excluded path list"),
        skin_no: z.array(z.number().int()).optional().nullable().describe("Skin number list"),
        integrity: z.string().optional().describe("Subresource integrity hash"),
      })
      .strict()
      .describe("Scripttag update payload"),
  })
  .strict();

export const ScripttagDeleteParamsSchema = z
  .object({
    shop_no: z.number().int().min(1).default(1).describe("Shop Number"),
    script_no: z.string().min(1).describe("Script number"),
  })
  .strict();

export type ScripttagsSearchParams = z.infer<typeof ScripttagsSearchParamsSchema>;
export type ScripttagsCountParams = z.infer<typeof ScripttagsCountParamsSchema>;
export type ScripttagDetailParams = z.infer<typeof ScripttagDetailParamsSchema>;
export type ScripttagCreateParams = z.infer<typeof ScripttagCreateParamsSchema>;
export type ScripttagUpdateParams = z.infer<typeof ScripttagUpdateParamsSchema>;
export type ScripttagDeleteParams = z.infer<typeof ScripttagDeleteParamsSchema>;
