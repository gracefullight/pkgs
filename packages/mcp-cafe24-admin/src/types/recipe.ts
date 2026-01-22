export type RecipeActiveStatus = "T" | "F";

export interface Recipe {
  recipe_code: string;
  recipe_name?: string;
  active?: RecipeActiveStatus;
}

export interface RecipesListResponse {
  recipes: Recipe[];
}

export interface RecipeTriggerFilter {
  name: string;
  value: string | number;
  operator: string;
}

export interface RecipeTriggerCondition {
  condition: RecipeTriggerFilter[];
}

export interface RecipeTriggerSettings {
  required_filters: RecipeTriggerFilter[];
  optional_filters?: RecipeTriggerCondition[];
}

export interface RecipeTriggerRequest {
  recipe_code: string;
  trigger_settings: RecipeTriggerSettings;
}

export interface RecipesCreateRequest {
  requests: RecipeTriggerRequest[];
}

export interface RecipesCreateResponse {
  recipes: Array<{
    recipe_code: string;
    active: RecipeActiveStatus;
  }>;
}

export interface RecipeDeleteResponse {
  recipe: {
    recipe_code: string;
  };
}
