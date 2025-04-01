/**
 * Image utility service for handling user images with multiple fallbacks
 */

// Default fallback images for different contexts
const DEFAULT_IMAGES = {
  user: "/src/assets/images/unknown_product.png",
  product: "/src/assets/images/unknown_product.png",
  avatar: "/src/assets/images/unknown_product.png",
  default: "/src/assets/images/unknown_product.png",
}

// Base API URL for constructing image URLs
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

/**
 * Checks if a string is a valid HTTP/HTTPS URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export const isHttpUrl = (url) => {
  if (!url || typeof url !== "string") return false
  return url.startsWith("http://") || url.startsWith("https://")
}

/**
 * Checks if a path is likely a local file path
 * @param {string} path - The path to check
 * @returns {boolean} - True if likely a local path, false otherwise
 */
export const isLocalPath = (path) => {
  if (!path || typeof path !== "string") return false
  // Check if it starts with common local path patterns
  return (
    path.startsWith("/") ||
    path.startsWith("./") ||
    path.startsWith("../") ||
    path.startsWith("src/") ||
    path.startsWith("uploads/")
  )
}

/**
 * Normalizes an image URL to ensure it's a full URL
 * @param {string} url - The URL or path to normalize
 * @returns {string} - The normalized URL
 */
export const normalizeImageUrl = (url) => {
  if (!url || typeof url !== "string") return null

  // If it's already a full URL, return it
  if (isHttpUrl(url)) return url

  // If it starts with a slash, it's a relative path to the API
  if (url.startsWith("/")) {
    // Remove any duplicate slashes between API_BASE_URL and url
    const baseWithoutTrailingSlash = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL

    const pathWithoutLeadingSlash = url.startsWith("/") ? url.slice(1) : url

    return `${baseWithoutTrailingSlash}/${pathWithoutLeadingSlash}`
  }

  

  // Otherwise, it might be a relative path to the current domain
  return url
}

/**
 * Gets the appropriate image URL with fallback, recursively checking objects
 * @param {any} source - The user object, image path, or nested object
 * @param {string} type - The type of image (user, product, avatar, etc.)
 * @param {number} depth - Current recursion depth (to prevent infinite recursion)
 * @returns {string|null} - The resolved image URL or null if not found
 */
export const getImageUrl = (source, type = "default", depth = 0) => {

  console.log(typeof source);
  
  // Prevent infinite recursion
  if (depth > 5) return null

  // If no source provided, return null
  if (!source) return null

  // If source is a string and looks like a URL or path, normalize it
  if (typeof source === "string") {
    // Only treat it as an image URL if it looks like one
    if (isHttpUrl(source) || isLocalPath(source)) {
      return normalizeImageUrl(source)
    }
    // Otherwise, it's probably not an image URL (e.g., it's a name)
    return null
  }

  // If source is an object, check common image properties
  if (typeof source === "object") {
    // First check for imageUrl which is our primary image property
    if (source.imageUrl) {
      return normalizeImageUrl(source.imageUrl)
    }

    // Check common image property names
    const imageProps = ["image", "avatar", "profilePicture", "profileImage", "photo", "picture"]

    for (const prop of imageProps) {
      if (source[prop]) {
        // Recursively check the property value
        const result = getImageUrl(source[prop], type, depth + 1)
        if (result) return result
      }
    }
  }

  // If no valid image found, return null
  return null
}

/**
 * Convenience function for getting user images
 * @param {any} user - The user object or image path
 * @returns {string|null} - The resolved image URL or null if not found
 */
export const getUserImageUrl = (user) => {
  // If user doesn't exist, return null
  if (!user) return null

  // If user has an ID, use the direct API endpoint
  if (user.id) {
    // This is the most reliable way to get user images based on the backend implementation
    return `${API_BASE_URL}/api/upload/profile-image/${user.id}`
  }

  // If there's an imageUrl but no ID, try to normalize it
  if (user.imageUrl) {
    return normalizeImageUrl(user.imageUrl)
  }

  return null
}

/**
 * Convenience function for getting product images
 * @param {any} product - The product object or image path
 * @returns {string|null} - The resolved image URL or null if not found
 */
export const getProductImageUrl = (product) => {
  return getImageUrl(product, "product")
}

/**
 * Generate a UI avatar URL for a user
 * @param {string} name - The name to use for the avatar
 * @returns {string} - The UI avatar URL
 */
export const getUiAvatarUrl = (name = "User") => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random`
}

/**
 * React component image error handler with UI-avatars fallback
 * @param {Event} e - The error event
 * @param {string} type - The type of image (user, product, avatar, etc.)
 * @param {string} name - Optional name for generating avatar
 * @param {Function} callback - Optional callback to execute when image fails to load
 */
export const handleImageError = (e, type = "default", name = null, callback = null) => {
  e.target.onerror = null // Prevent infinite loop

  // If it's a user avatar and we have a name, use UI-avatars
  if ((type === "avatar" || type === "user") && name) {
    e.target.src = getUiAvatarUrl(name)
  } else {
    // Otherwise use our default image
    e.target.src = DEFAULT_IMAGES[type] || DEFAULT_IMAGES.default
  }

  // Execute callback if provided
  if (typeof callback === "function") {
    callback(e)
  }
}

