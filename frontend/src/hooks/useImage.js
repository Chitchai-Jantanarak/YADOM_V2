"use client"

import { useState, useEffect } from "react"
import { getFallbackImage } from "../utils/imageUtils"
import imageService from "../services/ImageService"

/**
 * Hook for handling images with fallbacks
 * @param {string} src - The image source URL
 * @param {string} fallbackType - The type of fallback to use
 * @returns {Object} - Image state and handlers
 */
const useImage = (src, fallbackType = "generic") => {
  const [imageSrc, setImageSrc] = useState(src || getFallbackImage(fallbackType))
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    let isMounted = true

    const validateAndSetImage = async () => {
      setIsLoading(true)
      setHasError(false)

      if (!src) {
        if (isMounted) {
          setImageSrc(getFallbackImage(fallbackType))
          setIsLoading(false)
          setHasError(true)
        }
        return
      }

      try {
        // Validate the image URL
        const validatedUrl = await imageService.getValidatedImageUrl(src, fallbackType)

        if (isMounted) {
          setImageSrc(validatedUrl)
          setHasError(validatedUrl !== src)

          // Get image dimensions
          try {
            const dims = await imageService.getImageDimensions(validatedUrl)
            if (isMounted) {
              setDimensions(dims)
            }
          } catch (error) {
            console.error("Error getting image dimensions:", error)
          }
        }
      } catch (error) {
        console.error("Error validating image:", error)
        if (isMounted) {
          setImageSrc(getFallbackImage(fallbackType))
          setHasError(true)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    validateAndSetImage()

    return () => {
      isMounted = false
    }
  }, [src, fallbackType])

  const handleError = () => {
    setHasError(true)
    setImageSrc(getFallbackImage(fallbackType))
  }

  return {
    src: imageSrc,
    isLoading,
    hasError,
    dimensions,
    handleError,
  }
}

export default useImage

