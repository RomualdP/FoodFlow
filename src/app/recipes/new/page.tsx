"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@/components/ui/editor";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRecipe } from "@/lib/services/recipes";
import { IngredientsField, type RecipeIngredient } from "@/components/recipe-form/ingredients-field";
import { TagsField } from "@/components/recipe-form/tags-field";

export default function NewRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([
    { name: "", quantity: "", unit: "g" }
  ]);
  const [instructions, setInstructions] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const recipeData = {
        title,
        servings,
        instructions,
        ingredients: ingredients.map(ing => ({
          ingredient_id: ing.ingredientId!,
          quantity: parseFloat(ing.quantity),
          unit: ing.unit
        })),
        tags
      };

      await createRecipe(recipeData);
      router.push('/recipes');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Une erreur est survenue lors de la sauvegarde de la recette');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nouvelle recette</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          {/* Titre */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Titre de la recette</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Ex: Tarte aux pommes"
            />
          </div>

          {/* Nombre de personnes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre de personnes</label>
            <Input
              type="number"
              min={1}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              required
            />
          </div>

          {/* Ingrédients */}
          <IngredientsField 
            ingredients={ingredients}
            onChange={setIngredients}
          />

          {/* Tags */}
          <TagsField
            tags={tags}
            onChange={setTags}
          />

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Instructions de préparation</label>
            <Editor
              content={instructions}
              onChange={setInstructions}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer la recette"}
          </Button>
        </form>
      </div>
    </div>
  );
} 