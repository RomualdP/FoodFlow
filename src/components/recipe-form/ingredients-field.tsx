'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { UNITS } from "@/lib/constants/units"
import { useState, useEffect } from "react"
import { getIngredients, addIngredient, type Ingredient } from "@/lib/services/ingredients"

export interface RecipeIngredient {
  ingredientId?: number
  name: string
  quantity: string
  unit: string
}

interface IngredientsFieldProps {
  ingredients: RecipeIngredient[]
  onChange: (ingredients: RecipeIngredient[]) => void
}

function IngredientSearch({ 
  onSelect, 
  availableIngredients,
  ingredient,
  onAddNew 
}: { 
  onSelect: (value: string) => void
  availableIngredients: Ingredient[]
  ingredient: RecipeIngredient
  onAddNew: (value: string) => void
}) {
  const [search, setSearch] = useState("")
  const filteredIngredients = availableIngredients.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Command shouldFilter={false}>
      <CommandInput 
        placeholder="Rechercher un ingrédient..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        {search && (
          <CommandEmpty>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onAddNew(search)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter &apos;{search}&apos;
            </Button>
          </CommandEmpty>
        )}
        <CommandGroup>
          {filteredIngredients.map((item) => (
            <CommandItem
              key={item.id}
              value={item.name}
              onSelect={() => onSelect(item.name)}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  ingredient.name === item.name ? "opacity-100" : "opacity-0"
                )}
              />
              {item.name}
            </CommandItem>
          ))}
          {filteredIngredients.length === 0 && !search && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Commencez à taper pour rechercher ou ajouter un ingrédient
            </div>
          )}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export function IngredientsField({ ingredients, onChange }: IngredientsFieldProps) {
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
  const [openSelect, setOpenSelect] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadIngredients()
  }, [])

  const loadIngredients = async () => {
    try {
      setIsLoading(true)
      const data = await getIngredients()
      setAvailableIngredients(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des ingrédients:", error)
      setAvailableIngredients([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleIngredientSelect = async (index: number, value: string) => {
    const newIngredients = [...ingredients]
    const selectedIngredient = availableIngredients.find(i => i.name === value)
    
    if (selectedIngredient) {
      newIngredients[index] = {
        ...newIngredients[index],
        ingredientId: selectedIngredient.id,
        name: selectedIngredient.name,
      }
      onChange(newIngredients)
      setOpenSelect(null)
    }
  }

  const handleAddNewIngredient = async (index: number, value: string) => {
    try {
      const newIngredient = await addIngredient(value)
      await loadIngredients()
      const newIngredients = [...ingredients]
      newIngredients[index] = {
        ...newIngredients[index],
        ingredientId: newIngredient.id,
        name: newIngredient.name,
      }
      onChange(newIngredients)
      setOpenSelect(null)
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'ingrédient:", error)
    }
  }

  const addIngredientRow = () => {
    onChange([...ingredients, { name: "", quantity: "", unit: "g" }])
  }

  const removeIngredientRow = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof RecipeIngredient, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    onChange(newIngredients)
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Ingrédients</label>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Popover open={openSelect === index} onOpenChange={(open) => setOpenSelect(open ? index : null)}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full sm:flex-1 justify-between"
              >
                {ingredient.name || "Sélectionner un ingrédient"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Chargement des ingrédients...
                </div>
              ) : (
                <IngredientSearch 
                  onSelect={(value) => handleIngredientSelect(index, value)}
                  availableIngredients={availableIngredients}
                  ingredient={ingredient}
                  onAddNew={(value) => handleAddNewIngredient(index, value)}
                />
              )}
            </PopoverContent>
          </Popover>

          <div className="flex gap-2 sm:flex-none">
            <Input
              type="number"
              placeholder="Quantité"
              value={ingredient.quantity}
              onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
              required
              className="w-full sm:w-24"
            />

            <Select
              value={ingredient.unit}
              onValueChange={(value: string) => updateIngredient(index, "unit", value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Unité" />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              onClick={() => removeIngredientRow(index)}
              className="px-2"
            >
              ×
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addIngredientRow}>
        + Ajouter un ingrédient
      </Button>
    </div>
  )
} 