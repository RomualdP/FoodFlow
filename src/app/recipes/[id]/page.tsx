"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Clock, ChefHat, Users, Globe, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getRecipe, updateRecipeVisibility } from "@/lib/services/recipes"
import { supabase } from "@/lib/services/recipes"
import type { Recipe } from "@/lib/services/recipes"
import type { User } from "@supabase/supabase-js"

interface RecipePageProps {
  params: Promise<{
    id: string
  }>
}

export default function RecipePage({ params }: RecipePageProps) {
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const { id } = use(params)

  useEffect(() => {
    // Charger l'utilisateur courant
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    async function loadRecipe() {
      try {
        const data = await getRecipe(parseInt(id))
        setRecipe(data)
      } catch (err) {
        console.error('Erreur lors du chargement de la recette:', err)
        setError('Une erreur est survenue lors du chargement de la recette')
      } finally {
        setLoading(false)
      }
    }

    loadRecipe()
  }, [id])

  const handleVisibilityToggle = async () => {
    if (!recipe) return;
    
    try {
      await updateRecipeVisibility(recipe.id, !recipe.is_public);
      setRecipe(prev => prev ? { ...prev, is_public: !prev.is_public } : null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la visibilité:', err);
    }
  };

  const getTimeLabel = (time: string | undefined): string => {
    if (!time) return "Non défini";
    const minutes = parseInt(time);
    if (minutes < 20) return "Moins de 20 min";
    if (minutes <= 30) return "20-30 min";
    if (minutes <= 45) return "30-45 min";
    if (minutes <= 60) return "45-60 min";
    if (minutes <= 90) return "1h-1h30";
    return "Plus de 1h30";
  };

  const getDifficultyColor = (difficulty: string = 'medium') => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyLabel = (difficulty: string = 'medium') => {
    switch (difficulty) {
      case "easy":
        return "Facile"
      case "medium":
        return "Intermédiaire"
      case "hard":
        return "Difficile"
      default:
        return difficulty
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement de la recette...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Recette non trouvée'}</p>
            <Button onClick={() => router.back()}>
              Retour
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="max-w-3xl mx-auto">
        {/* En-tête avec bouton retour et visibilité */}
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux recettes
          </Button>

          {currentUser && recipe?.user_id === currentUser.id && (
            <Button
              variant="outline"
              onClick={handleVisibilityToggle}
              className="gap-2"
            >
              {recipe.is_public ? (
                <>
                  <Globe className="w-4 h-4" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Privé
                </>
              )}
            </Button>
          )}
        </div>

        {/* En-tête de la recette */}
        <div className="mb-8">
          {/* Image de la recette */}
          <div className="relative h-[400px] rounded-xl overflow-hidden bg-muted mb-6">
            {recipe.image_url ? (
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ChefHat className="w-20 h-20 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Titre et informations */}
          <div>
            <h1 className="text-4xl font-bold mb-6">{recipe.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {getTimeLabel(recipe.preparation_time)}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                <ChefHat className="w-5 h-5 text-muted-foreground" />
                <span className={`text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {getDifficultyLabel(recipe.difficulty)}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">{recipe.servings} personnes</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {recipe.recipe_tags?.filter(tag => 
                !['preparation_time', 'difficulty', 'servings'].includes(tag.category) 
              ).map((tag) => (
                <Badge 
                  key={`${tag.category}-${tag.value}`} 
                  variant="secondary"
                  className="text-xs bg-gray-100 px-2 py-1"
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Ingrédients */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Ingrédients</h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recipe.recipe_ingredients?.map((ingredient) => (
              <li 
                key={ingredient.ingredient_id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <span className="font-medium">{ingredient.ingredients.name}</span>
                <span className="text-muted-foreground">
                  {ingredient.quantity} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
          <div 
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: recipe.instructions }}
          />
        </div>
      </div>
    </div>
  )
} 