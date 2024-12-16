import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

export interface Recipe {
  id: number;
  title: string;
  servings: number;
  instructions: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  preparation_time?: string;
  difficulty?: string;
  recipe_tags?: Array<{
    category: string;
    value: string;
    label: string;
  }>;
  tags?: Array<{
    id: string;
    name: string;
    category: string;
  }>;
}

export interface RecipeTag {
  category: string;
  value: string;
  label: string;
}

export interface CreateRecipeData {
  title: string;
  servings: number;
  instructions: string;
  image_url?: string | null;
  ingredients: {
    ingredient_id: number;
    quantity: number;
    unit: string;
  }[];
  tags: RecipeTag[];
}

export async function createRecipe(data: CreateRecipeData) {
  const { title, servings, instructions, ingredients, tags, image_url } = data;

  // Extraire les tags spéciaux qui vont dans la table recipes
  const preparationTime = tags.find(tag => tag.category === 'preparation_time')?.value;
  const difficulty = tags.find(tag => tag.category === 'difficulty')?.value;

  // Récupérer l'utilisateur courant
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Utilisateur non authentifié");

  // Commencer une transaction
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .insert([
      { 
        title, 
        servings, 
        instructions,
        image_url,
        preparation_time: preparationTime,
        difficulty,
        user_id: user.id
      }
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
          category: tag.category,
          value: tag.value,
          label: tag.label
        }))
      );

    if (tagsError) throw tagsError;
  }

  return recipe;
}

export async function deleteRecipeImage(imagePath: string) {
  const { error } = await supabase.storage
    .from('recipes')
    .remove([imagePath]);

  if (error) throw error;
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
        category,
        value,
        label
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
        category,
        value,
        label
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
  