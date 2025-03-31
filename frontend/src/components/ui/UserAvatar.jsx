"use client"

import { useState, useEffect, useRef } from "react"
import { getUserImageUrl, getUiAvatarUrl } from "../../utils/imageUtils.js"
import { debugImageLoading } from "../../utils/debugUtils.js"
import imageService from "../../services/imageService.js"

/**
 * UserAvatar component that displays a user's avatar with fallback
 * @param {Object} props - Component props
 * @param {Object} props.user - User object from Prisma
 * @param {string} props.size - Size of avatar (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fallbackType - Type of fallback image to use
 * @param {Function} props.onImageError - Callback for image error
 */
const UserAvatar = ({ user, size = "md", className = "", fallbackType = "avatar", onImageError = null }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const errorHandledRef = useRef(false)

  // Determine size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }

  const sizeClass = sizeClasses[size] || sizeClasses.md

  // Update image URL when user changes
  useEffect(() => {
    const loadUserImage = async () => {
      if (user) {
        // Reset error handling state when user changes
        errorHandledRef.current = false
        setImageError(false)

        if (user.id) {
          try {
            // Try to get the image URL from the API
            const result = await imageService.getProfileImage(user.id)
            if (result.success && result.url) {
              setImageUrl(result.url)
              // debugImageLoading("UserAvatar-API", result.url, user)
              return
            }
          } catch (error) {
            console.error("Error loading profile image:", error)
          }
        }

        // Fall back to the utility function
        const url = getUserImageUrl(user)
        setImageUrl(url)
        setImageError(!url) // Set error state if URL is null
        // debugImageLoading("UserAvatar", url, user)
      }
    }

    loadUserImage()
  }, [user])

  // Handle image error
  const onImageErrorHandler = (e) => {
    // Prevent multiple error handling for the same image
    if (errorHandledRef.current) return
    errorHandledRef.current = true

    console.log("Image error:", e.target.src)
    setImageError(true)

    // Use the callback from props if provided
    if (typeof onImageError === "function") {
      onImageError(e)
    } else {
      // Otherwise use the default handler
      e.target.onerror = null // Prevent infinite loop
      e.target.src = getUiAvatarUrl(user?.name)
    }
  }

  return (
    <div className={`relative rounded-full overflow-hidden ${sizeClass} ${className}`}>
      {/* Show skeleton loader while image is loading */}
      {!imageLoaded && !imageError && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}

      <img
        src={imageError ? getUiAvatarUrl(user?.name) : imageUrl || getUiAvatarUrl(user?.name)}
        alt={user?.name || "User"}
        className={`object-cover w-full h-full ${imageLoaded || imageError ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        onLoad={() => setImageLoaded(true)}
        onError={onImageErrorHandler}
      />
    </div>
  )
}

export default UserAvatar

