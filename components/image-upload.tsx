"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Image as ImageIcon, Camera } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  currentImage?: string
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
  disabled?: boolean
}

export function ImageUpload({ 
  onImageSelect, 
  currentImage, 
  maxSize = 5, 
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  className = "",
  disabled = false
}: ImageUploadProps) {
  const { t } = useTranslation()
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError(null)
    
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(t("invalid_file_type"))
      return
    }
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(t("file_too_large", { maxSize }))
      return
    }
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    
    onImageSelect(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const removeImage = () => {
    setPreview(null)
    setError(null)
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
      
      {preview ? (
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={openFileDialog}
                    disabled={disabled}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {t("change_image")}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t("remove_image")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragActive 
              ? "border-green-500 bg-green-50" 
              : "border-gray-300 hover:border-gray-400"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {t("upload_image")}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {t("drag_drop_or_click")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t("choose_file")}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                {t("supported_formats")}: JPG, PNG, WebP • {t("max_size")}: {maxSize}MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
