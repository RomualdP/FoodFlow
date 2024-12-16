'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RecipeFilters } from "@/components/recipe-filters"
import { RecipeCard } from "@/components/recipe-card"
import { Input } from "@/components/ui/input"
import { getRecipes } from "@/lib/services/recipes"
import type { Recipe } from "@/lib/services/recipes"

interface SelectedFilters {
  [category: string]: string[];
}

const getTimeFilterPredicate = (preparationTime: string | undefined, filterValue: string): boolean => {
  if (!preparationTime) return false;
  const time = parseInt(preparationTime);
  
  switch (filterValue) {
    case 'under_20':
      return time < 20;
    case '20_30':
      return time >= 20 && time <= 30;
    case '30_45':
      return time > 30 && time <= 45;
    case '45_60':
      return time > 45 && time <= 60;
    case '60_90':
      return time > 60 && time <= 90;
    case 'over_90':
      return time > 90;
    default:
      return false;
  }
};

export default function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRecipes() {
      try {
        const data = await getRecipes()
        setRecipes(data || [])
      } catch (err) {
        console.error('Erreur lors du chargement des recettes:', err)
        setError('Une erreur est survenue lors du chargement des recettes')
      } finally {
        setLoading(false)
      }
    }

    loadRecipes()
  }, [])

  // Filtrage des recettes
  const filteredRecipes = recipes
    .filter(recipe => {
      // Filtrage par recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return recipe.title.toLowerCase().includes(query);
      }
      return true;
    })
    .filter(recipe => {
      // Filtrage par tags sélectionnés
      if (Object.keys(selectedFilters).length === 0) return true;

      return recipe.recipe_tags?.some(tag => {
        // Pour le temps de préparation, utiliser la nouvelle logique
        if (tag.category === 'preparation_time' && selectedFilters[tag.category]) {
          return selectedFilters[tag.category].some(filterValue => 
            getTimeFilterPredicate(recipe.preparation_time, filterValue)
          );
        }
        // Pour les autres catégories, garder la logique existante
        return selectedFilters[tag.category]?.includes(tag.value);
      });
    });

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des recettes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mes recettes</h1>
        <Link href="/recipes/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle recette
          </Button>
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Aucune recette pour le moment</h2>
          <p className="text-muted-foreground mb-6">
            Commencez par ajouter votre première recette !
          </p>
          <Link href="/recipes/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Créer une recette
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar avec filtres */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-4">
              <Input
                type="search"
                placeholder="Rechercher une recette..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
              <RecipeFilters onFiltersChange={setSelectedFilters} />
            </div>
          </div>

          {/* Grille de recettes */}
          <div className="lg:col-span-3">
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  Aucune recette ne correspond à vos critères.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
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
            )}
          </div>
        </div>
      )}
    </div>
  )
} 