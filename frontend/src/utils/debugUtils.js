/**
 * Utility functions for debugging
 */

// Enable or disable debug mode
const DEBUG_MODE = true

/**
 * Log debug messages to console if debug mode is enabled
 * @param {string} category - The category of the debug message
 * @param {...any} args - The arguments to log
 */
export const debugLog = (category, ...args) => {
  if (DEBUG_MODE) {
    console.log(`[DEBUG:${category}]`, ...args)
  }
}

/**
 * Debug image loading issues
 * @param {string} componentName - The name of the component
 * @param {string} imageUrl - The URL of the image
 * @param {Object} user - The user object
 */
export const debugImageLoading = (componentName, imageUrl, user) => {
  if (!DEBUG_MODE) return

  console.group(`[Image Debug: ${componentName}]`)
  console.log("Image URL:", imageUrl)
  console.log("User object:", user)

  if (user?.imageUrl) {
    console.log("User imageUrl:", user.imageUrl)
    console.log("Is HTTP URL:", user.imageUrl.startsWith("http"))
    console.log("Is relative path:", user.imageUrl.startsWith("/"))
  }

  console.groupEnd()
}

