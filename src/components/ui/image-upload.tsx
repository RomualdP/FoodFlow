'use client'

import { UploadCloud } from "lucide-react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number
  className?: string
}

export function ImageUpload({ 
  onChange, 
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  className 
}: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      onChange(acceptedFiles[0])
    }
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      [accept]: []
    },
    maxSize,
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <UploadCloud className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive ? (
            "Déposez l'image ici"
          ) : (
            <>
              Glissez-déposez une image ici, ou cliquez pour sélectionner
              <br />
              <span className="text-xs">
                PNG, JPG ou WEBP jusqu&apos;à {Math.round(maxSize / 1024 / 1024)}MB
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
} 