import Image from "next/image"
import Link from "next/link"
import { Clock, ChefHat, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface RecipeCardProps {
  recipe: {
    id: string
    title: string
    image_url?: string
    preparationTime: number
    difficulty: string
    servings: number
    tags: Array<{
      id: string
      name: string
      category: string
    }>
  }
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const getDifficultyColor = (difficulty: string) => {
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

  const getDifficultyLabel = (difficulty: string) => {
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

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video bg-muted">
          {recipe.image_url ? (
            <Image
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <ChefHat className="w-12 h-12" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">
            {recipe.title}
          </h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.preparationTime > 0 ? `${recipe.preparationTime} min` : 'Non défini'}</span>
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                {getDifficultyLabel(recipe.difficulty)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} pers.</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
            {recipe.tags.length > 3 && (
              <Badge variant="secondary">+{recipe.tags.length - 3}</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 