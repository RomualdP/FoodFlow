'use client'

import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { FILTER_CATEGORIES } from "@/lib/constants/recipe-filters"
import { cn } from "@/lib/utils"
import { RecipeTag } from "@/lib/services/recipes"

interface TagsFieldProps {
  tags: RecipeTag[]
  onChange: (tags: RecipeTag[]) => void
}

export function TagsField({ tags, onChange }: TagsFieldProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const handleSelect = (categoryId: string, value: string, label: string) => {
    const newTag: RecipeTag = {
      category: categoryId,
      value,
      label,
    }

    const tagExists = tags.some(tag => 
      tag.category === categoryId && tag.value === value
    )

    if (!tagExists) {
      onChange([...tags, newTag])
    }
  }

  const removeTag = (tagToRemove: RecipeTag) => {
    onChange(tags.filter(tag => 
      !(tag.category === tagToRemove.category && tag.value === tagToRemove.value)
    ))
  }

  const getTagsByCategory = (categoryId: string) => {
    return tags.filter(tag => tag.category === categoryId)
  }

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Tags</label>
      
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
                  getTagsByCategory(category.id).length > 0 && "border-primary"
                )}
              >
                {category.label}
                {getTagsByCategory(category.id).length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {getTagsByCategory(category.id).length}
                  </Badge>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder={`Rechercher...`} />
                <CommandList>
                  <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                  <CommandGroup>
                    {category.options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => handleSelect(category.id, option.value, option.label)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            tags.some(tag => 
                              tag.category === category.id && tag.value === option.value
                            )
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={`${tag.category}-${tag.value}`}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {tag.label}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
} 