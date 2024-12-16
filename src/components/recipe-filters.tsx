'use client'

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { FILTER_CATEGORIES, FilterCategory } from "@/lib/constants/recipe-filters"
import { cn } from "@/lib/utils"

type SelectedFilters = {
  [K: string]: string[]
}

interface RecipeFiltersProps {
  onFiltersChange: (filters: SelectedFilters) => void
}

export function RecipeFilters({ onFiltersChange }: RecipeFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const handleSelect = (categoryId: string, value: string) => {
    const currentValues = selectedFilters[categoryId] || []
    let newValues: string[]

    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v) => v !== value)
    } else {
      newValues = [...currentValues, value]
    }

    const newFilters = {
      ...selectedFilters,
      [categoryId]: newValues,
    }

    if (newValues.length === 0) {
      delete newFilters[categoryId]
    }

    setSelectedFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const getSelectedLabels = (category: FilterCategory) => {
    const values = selectedFilters[category.id] || []
    return values.map(value => {
      const option = category.options.find(opt => opt.value === value)
      return option?.label || value
    })
  }

  const getTotalFilters = () => {
    return Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0)
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    onFiltersChange({})
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filtres</h2>
        {getTotalFilters() > 0 && (
          <Button
            variant="ghost"
            className="text-sm text-muted-foreground"
            onClick={clearAllFilters}
          >
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_CATEGORIES.map((category) => (
          <Popover
            key={category.id}
            open={openCategory === category.id}
            onOpenChange={(isOpen) => setOpenCategory(isOpen ? category.id : null)}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "justify-between",
                  (selectedFilters[category.id]?.length || 0) > 0 && "border-primary"
                )}
              >
                {category.label}
                {(selectedFilters[category.id]?.length || 0) > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedFilters[category.id]?.length}
                  </Badge>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder={`Rechercher...`} />
                <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                <CommandGroup>
                  {category.options.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(category.id, option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedFilters[category.id]?.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      {getTotalFilters() > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {FILTER_CATEGORIES.map((category) => {
            const selectedLabels = getSelectedLabels(category)
            return selectedLabels.map((label) => (
              <Badge
                key={`${category.id}-${label}`}
                variant="secondary"
                className="gap-1"
              >
                {label}
              </Badge>
            ))
          })}
        </div>
      )}
    </div>
  )
} 