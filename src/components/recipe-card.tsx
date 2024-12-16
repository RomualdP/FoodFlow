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
  const getTimeLabel = (time: number): string => {
    if (time < 20) return "Moins de 20 min";
    if (time <= 30) return "20-30 min";
    if (time <= 45) return "30-45 min";
    if (time <= 60) return "45-60 min";
    if (time <= 90) return "1h-1h30";
    return "Plus de 1h30";
  };

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
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
            {recipe.title}
          </h3>
          <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-4">
            <div className="flex flex-col items-center text-center">
              <Clock className="w-4 h-4 mb-1" />
              <span className="text-xs">{recipe.preparationTime > 0 ? getTimeLabel(recipe.preparationTime) : 'Non défini'}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <ChefHat className="w-4 h-4 mb-1" />
              <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                {getDifficultyLabel(recipe.difficulty)}
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="w-4 h-4 mb-1" />
              <span className="text-xs">{recipe.servings} pers.</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.tags
              .filter(tag => !['preparation_time', 'difficulty', 'servings'].includes(tag.category))
              .slice(0, 3)
              .map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="secondary"
                  className="text-xs bg-gray-100 px-2 py-1"
                >
                  {tag.name}
                </Badge>
              ))}
            {recipe.tags.filter(tag => !['preparation_time', 'difficulty', 'servings'].includes(tag.category)).length > 3 && (
              <Badge 
                variant="secondary"
                className="text-xs bg-gray-100 px-2 py-1"
              >
                +{recipe.tags.filter(tag => !['preparation_time', 'difficulty', 'servings'].includes(tag.category)).length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 