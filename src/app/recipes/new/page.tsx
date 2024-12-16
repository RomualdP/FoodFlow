"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@/components/ui/editor";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRecipe, type RecipeTag } from "@/lib/services/recipes";
import { IngredientsField, type RecipeIngredient } from "@/components/recipe-form/ingredients-field";
import { TagsField } from "@/components/recipe-form/tags-field";
import { ImageUpload } from "@/components/ui/image-upload";
import Image from "next/image";
import { supabase } from "@/lib/services/recipes";
import { v4 as uuidv4 } from 'uuid';

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
  const [tags, setTags] = useState<RecipeTag[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `recipe-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('recipes')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('recipes')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const recipeData = {
        title,
        servings,
        instructions,
        image_url: imageUrl,
        ingredients: ingredients.map(ing => ({
          ingredient_id: ing.ingredientId!,
          quantity: parseFloat(ing.quantity),
          unit: ing.unit
        })),
        tags: tags.map(tag => ({
          category: tag.category,
          value: tag.value,
          label: tag.label
        }))
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

          {/* Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Image de la recette</label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Aperçu de l'image"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleImageChange(null)}
                  >
                    Supprimer
                  </Button>
                </div>
              ) : (
                <ImageUpload
                  onChange={handleImageChange}
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              )}
            </div>
          </div>

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