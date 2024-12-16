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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
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

export function IngredientsField({ ingredients, onChange }: IngredientsFieldProps) {
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([])
  const [openSelect, setOpenSelect] = useState<number | null>(null)
  const [commandValue, setCommandValue] = useState("")

  useEffect(() => {
    loadIngredients()
  }, [])

  const loadIngredients = async () => {
    try {
      const data = await getIngredients()
      setAvailableIngredients(data)
    } catch (error) {
      console.error("Erreur lors du chargement des ingrédients:", error)
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
    } else {
      try {
        const newIngredient = await addIngredient(value)
        await loadIngredients()
        newIngredients[index] = {
          ...newIngredients[index],
          ingredientId: newIngredient.id,
          name: newIngredient.name,
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'ingrédient:", error)
      }
    }
    
    onChange(newIngredients)
    setOpenSelect(null)
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
        <div key={index} className="flex gap-2">
          <Popover open={openSelect === index} onOpenChange={(open) => setOpenSelect(open ? index : null)}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="flex-grow justify-between"
              >
                {ingredient.name || "Sélectionner un ingrédient"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput 
                  placeholder="Rechercher un ingrédient..." 
                  value={commandValue}
                  onValueChange={setCommandValue}
                />
                <CommandEmpty>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleIngredientSelect(index, commandValue)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter &apos;{commandValue}&apos;
                  </Button>
                </CommandEmpty>
                <CommandGroup>
                  {availableIngredients.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleIngredientSelect(index, item.name)}
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
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Input
            type="number"
            placeholder="Quantité"
            value={ingredient.quantity}
            onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
            required
            className="w-24"
          />

          <Select
            value={ingredient.unit}
            onValueChange={(value: string) => updateIngredient(index, "unit", value)}
          >
            <SelectTrigger className="h-9 border bg-background text-foreground flex items-center justify-between px-2 text-sm rounded-md">
              <SelectValue placeholder="Unité" className="text-muted-foreground" />
              {/* <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" /> */}
            </SelectTrigger>
            <SelectContent className="text-sm bg-background border p-2 rounded-md">
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
      ))}
      <Button type="button" variant="outline" onClick={addIngredientRow}>
        + Ajouter un ingrédient
      </Button>
    </div>
  )
} 