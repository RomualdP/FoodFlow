import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

export interface Recipe {
  id: number;
  title: string;
  servings: number;
  instructions: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateRecipeData {
  title: string;
  servings: number;
  instructions: string;
  ingredients: {
    ingredient_id: number;
    quantity: number;
    unit: string;
  }[];
  tags: string[];
}

export async function createRecipe(data: CreateRecipeData) {
  const { title, servings, instructions, ingredients, tags } = data;

  // Commencer une transaction
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert([
      { title, servings, instructions }
    ])
    .select()
    .single();

  if (recipeError) throw recipeError;

  // Ajouter les ingrédients
  if (ingredients.length > 0) {
    const { error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .insert(
        ingredients.map(ing => ({
          recipe_id: recipe.id,
          ingredient_id: ing.ingredient_id,
          quantity: ing.quantity,
          unit: ing.unit
        }))
      );

    if (ingredientsError) throw ingredientsError;
  }

  // Ajouter les tags
  if (tags.length > 0) {
    const { error: tagsError } = await supabase
      .from('recipe_tags')
      .insert(
        tags.map(tag => ({
          recipe_id: recipe.id,
          tag
        }))
      );

    if (tagsError) throw tagsError;
  }

  return recipe;
}

export async function getRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients (
        ingredient_id,
        quantity,
        unit,
        ingredients (
          name
        )
      ),
      recipe_tags (
        tag
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getRecipe(id: number) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      recipe_ingredients (
        ingredient_id,
        quantity,
        unit,
        ingredients (
          name
        )
      ),
      recipe_tags (
        tag
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
} 