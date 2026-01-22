import { z } from "zod";

/**
 * Schema for listing custom properties (no parameters needed)
 */
export const CustomPropertiesListParamsSchema = z.object({}).strict();

export type CustomPropertiesListParams = z.infer<typeof CustomPropertiesListParamsSchema>;

/**
 * Schema for a single custom property
 */
const CustomPropertyItemSchema = z.object({
  property_name: z.string().describe("User-defined property name (required)"),
});

/**
 * Schema for creating custom properties
 */
export const CustomPropertiesCreateParamsSchema = z
  .object({
    custom_properties: z
      .array(CustomPropertyItemSchema)
      .min(1)
      .describe("Array of custom properties to create"),
  })
  .strict();

export type CustomPropertiesCreateParams = z.infer<typeof CustomPropertiesCreateParamsSchema>;

/**
 * Schema for updating a custom property
 */
export const CustomPropertyUpdateParamsSchema = z
  .object({
    property_no: z.number().describe("User-defined property number (required)"),
    property_name: z
      .string()
      .max(250)
      .describe("User-defined property name (required, max 250 chars)"),
  })
  .strict();

export type CustomPropertyUpdateParams = z.infer<typeof CustomPropertyUpdateParamsSchema>;

/**
 * Schema for deleting a custom property
 */
export const CustomPropertyDeleteParamsSchema = z
  .object({
    property_no: z.number().describe("User-defined property number (required)"),
  })
  .strict();

export type CustomPropertyDeleteParams = z.infer<typeof CustomPropertyDeleteParamsSchema>;
