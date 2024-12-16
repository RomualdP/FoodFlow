'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getRandomRecipes } from "@/lib/services/recipes"
import { supabase } from "@/lib/services/recipes"
import { RecipeCard } from "@/components/recipe-card"
import type { Recipe } from "@/lib/services/recipes"
import type { User } from '@supabase/supabase-js'

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Charger les suggestions de recettes
        getRandomRecipes(5).then(recipes => {
          setSuggestedRecipes(recipes);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Suggestions de recettes</h1>
        {suggestedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={{
                  ...recipe,
                  id: recipe.id.toString(),
                  difficulty: recipe.difficulty || "medium",
                  preparationTime: recipe.preparation_time ? parseInt(recipe.preparation_time) : 0,
                  tags: recipe.recipe_tags?.map(tag => ({
                    id: `${tag.category}-${tag.value}`,
                    name: tag.label,
                    category: tag.category
                  })) || []
                }} 
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Aucune recette disponible pour le moment.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Bienvenue sur FoodFlow
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Organisez vos recettes, planifiez vos repas et simplifiez votre cuisine au quotidien.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg">
              Commencer gratuitement
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Se connecter
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1: Recipes */}
            <div className="text-center">
              <div className="h-40 relative rounded-lg mb-6">
                <Image
                  src="/undraw_recipes.png"
                  alt="Illustration de recettes de cuisine"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Gestion de vos recettes
              </h3>
              <p className="text-muted-foreground">
                Créez, organisez et retrouvez facilement toutes vos recettes préférées. 
                Ajoutez des photos, des notes et des astuces personnelles.
              </p>
            </div>

            {/* Feature 2: Planning */}
            <div className="text-center">
              <div className="h-40 relative rounded-lg mb-6">
                <Image
                  src="/undraw_planning.png"
                  alt="Illustration de planning de repas"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Planning intelligent
              </h3>
              <p className="text-muted-foreground">
                Générez automatiquement votre planning de repas de la semaine. 
                Équilibré, varié et adapté à vos préférences.
              </p>
            </div>

            {/* Feature 3: Shopping */}
            <div className="text-center">
              <div className="h-40 relative rounded-lg mb-6">
                <Image
                  src="/undraw_shopping.png"
                  alt="Illustration de liste de courses"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Liste de courses automatique
              </h3>
              <p className="text-muted-foreground">
                Obtenez instantanément votre liste de courses basée sur votre planning. 
                Organisée par rayon pour faciliter vos achats.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
