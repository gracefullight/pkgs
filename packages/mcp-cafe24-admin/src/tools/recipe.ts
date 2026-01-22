import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  type RecipeDeleteParams,
  RecipeDeleteParamsSchema,
  type RecipesCreateParams,
  RecipesCreateParamsSchema,
  type RecipesListParams,
  RecipesListParamsSchema,
} from "@/schemas/recipe.js";
import { handleApiError, makeApiRequest } from "@/services/api-client.js";
import type {
  RecipeDeleteResponse,
  RecipesCreateRequest,
  RecipesCreateResponse,
  RecipesListResponse,
} from "@/types/index.js";

async function cafe24_list_recipes(_params: RecipesListParams) {
  try {
    const data = await makeApiRequest<RecipesListResponse>("/admin/recipes", "GET");
    const recipes = data.recipes ?? [];
    const listText =
      recipes.length > 0
        ? recipes
            .map(
              (recipe) =>
                `- ${recipe.recipe_code} ${recipe.recipe_name ?? ""} (Active: ${recipe.active ?? "N/A"})`,
            )
            .join("\n")
        : "No recipes found.";

    return {
      content: [
        {
          type: "text" as const,
          text: `Found ${recipes.length} recipe(s):\n${listText}`,
        },
      ],
      structuredContent: {
        recipes,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_create_recipes(params: RecipesCreateParams) {
  try {
    const payload: RecipesCreateRequest = {
      requests: params.requests,
    };

    const data = await makeApiRequest<RecipesCreateResponse>("/admin/recipes", "POST", payload);
    const recipes = data.recipes ?? [];

    const listText =
      recipes.length > 0
        ? recipes.map((recipe) => `- ${recipe.recipe_code} (Active: ${recipe.active})`).join("\n")
        : "No recipes returned.";

    return {
      content: [
        {
          type: "text" as const,
          text: `Created/updated ${recipes.length} recipe trigger setting(s):\n${listText}`,
        },
      ],
      structuredContent: {
        recipes,
      },
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

async function cafe24_delete_recipe(params: RecipeDeleteParams) {
  try {
    const { recipe_code } = params;
    const data = await makeApiRequest<RecipeDeleteResponse>(
      `/admin/recipes/${recipe_code}`,
      "DELETE",
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `Deleted recipe: ${data.recipe.recipe_code}`,
        },
      ],
      structuredContent: data,
    };
  } catch (error) {
    return { content: [{ type: "text" as const, text: handleApiError(error) }] };
  }
}

export function registerTools(server: McpServer): void {
  server.registerTool(
    "cafe24_list_recipes",
    {
      title: "List Cafe24 Recipes",
      description: "Retrieve a list of recipes configured in Cafe24.",
      inputSchema: RecipesListParamsSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    cafe24_list_recipes,
  );

  server.registerTool(
    "cafe24_create_recipes",
    {
      title: "Create Cafe24 Recipe Trigger Settings",
      description: "Create or update recipe trigger settings in bulk.",
      inputSchema: RecipesCreateParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_create_recipes,
  );

  server.registerTool(
    "cafe24_delete_recipe",
    {
      title: "Delete Cafe24 Recipe",
      description: "Delete a recipe by its code.",
      inputSchema: RecipeDeleteParamsSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    cafe24_delete_recipe,
  );
}
