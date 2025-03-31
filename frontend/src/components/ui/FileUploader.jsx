"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, Check, AlertTriangle, Camera, Package } from "lucide-react"
import { validateProductFile, saveProductFile } from "../../utils/fileUtils"

export default function FileUploader({ productId, productType, onUploadComplete, currentFilePath = null }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Set the preview if there's a current file path
    if (currentFilePath) {
      setPreview(currentFilePath)
    }
  }, [currentFilePath])

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate the file
    const validation = validateProductFile(file, productType)
    if (!validation.success) {
      setError(validation.message)
      return
    }

    // For image files, show a preview
    if (productType === "ACCESSORY") {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }

    try {
      setUploading(true)
      setProgress(0)
      setError(null)
      setSuccess(false)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Save the file
      const result = await saveProductFile(file, productType, productId)

      clearInterval(progressInterval)

      if (result.success) {
        setProgress(100)
        setSuccess(true)
        if (onUploadComplete) {
          onUploadComplete(result.path)
        }
      } else {
        setError(result.message)
        setProgress(0)
      }
    } catch (err) {
      console.error("Error uploading file:", err)
      setError("An error occurred while uploading the file")
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-4">
      <div
        onClick={handleClick}
        className={`border-2 border-dashed ${error ? "border-red-300" : "border-gray-300"} rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors relative overflow-hidden`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={productType === "MAIN_PRODUCT" ? ".glb" : ".png,.jpg,.jpeg"}
          className="hidden"
        />

        {productType === "ACCESSORY" && preview ? (
          <img
            src={preview || "/placeholder.svg"}
            alt="Product preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/frontend/src/assets/images/unknown_product.png"
              setError("Failed to load image preview")
            }}
          />
        ) : !uploading && !success ? (
          <>
            {productType === "MAIN_PRODUCT" ? (
              <Package className="h-12 w-12 text-gray-400 mb-2" />
            ) : (
              <Camera className="h-12 w-12 text-gray-400 mb-2" />
            )}
            <p className="text-sm font-medium text-gray-700">
              Click to upload {productType === "MAIN_PRODUCT" ? "3D model (.glb)" : "image"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {productType === "MAIN_PRODUCT" ? "Max size: 50MB" : "Recommended size: 800x800px. Max size: 2MB"}
            </p>
          </>
        ) : null}

        {/* Upload progress indicator */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <Upload className="h-10 w-10 text-white mb-2 animate-pulse" />
            <p className="text-sm font-medium text-white">Uploading...</p>
            <div className="w-3/4 bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {success && !preview && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <Check className="h-10 w-10 text-green-500 mb-2" />
            <p className="text-sm font-medium text-white">File uploaded successfully</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center text-red-500 text-sm">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  )
}

