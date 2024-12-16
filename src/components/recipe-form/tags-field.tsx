'use client'

import { Input } from "@/components/ui/input"
import { useState } from "react"

interface TagsFieldProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function TagsField({ tags, onChange }: TagsFieldProps) {
  const [newTag, setNewTag] = useState("")

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault()
      if (!tags.includes(newTag.trim())) {
        onChange([...tags, newTag.trim()])
      }
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-primary/80"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <Input
        placeholder="Ajouter un tag (Entrée pour valider)"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
        onKeyDown={addTag}
      />
    </div>
  )
} 