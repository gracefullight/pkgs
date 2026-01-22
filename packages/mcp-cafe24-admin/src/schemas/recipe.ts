import { z } from "zod";

const RecipeTriggerFilterSchema = z
  .object({
    name: z.string().min(1).describe("Condition name"),
    value: z.union([z.string(), z.number()]).describe("Condition value"),
    operator: z.string().min(1).describe("Conditional operator"),
  })
  .strict();

const RecipeTriggerConditionSchema = z
  .object({
    condition: z.array(RecipeTriggerFilterSchema).min(1).describe("Condition group"),
  })
  .strict();

const RecipeTriggerSettingsSchema = z
  .object({
    required_filters: z
      .array(RecipeTriggerFilterSchema)
      .min(1)
      .describe("Required filter conditions"),
    optional_filters: z
      .array(RecipeTriggerConditionSchema)
      .optional()
      .describe("Optional filter groups"),
  })
  .strict();

const RecipeTriggerRequestSchema = z
  .object({
    recipe_code: z.string().min(1).describe("Recipe code"),
    trigger_settings: RecipeTriggerSettingsSchema.describe("Trigger settings"),
  })
  .strict();

export const RecipesListParamsSchema = z.object({}).strict();

export const RecipesCreateParamsSchema = z
  .object({
    requests: z
      .array(RecipeTriggerRequestSchema)
      .min(1)
      .describe("List of recipe trigger settings"),
  })
  .strict();

export const RecipeDeleteParamsSchema = z
  .object({
    recipe_code: z.string().min(1).describe("Recipe code"),
  })
  .strict();

export type RecipesListParams = z.infer<typeof RecipesListParamsSchema>;
export type RecipesCreateParams = z.infer<typeof RecipesCreateParamsSchema>;
export type RecipeDeleteParams = z.infer<typeof RecipeDeleteParamsSchema>;
