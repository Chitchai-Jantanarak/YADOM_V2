/**
 * Image utility service for handling user images with multiple fallbacks
 */

// Default fallback images for different contexts
const DEFAULT_IMAGES = {
  user: '/src/assets/images/unknown_product.png',
  product: '/src/assets/images/unknown_product.png',
  avatar: '/src/assets/images/unknown_product.png',
  default: '/src/assets/images/unknown_product.png'
};

/**
 * Checks if a string is a valid HTTP/HTTPS URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export const isHttpUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Checks if a path is likely a local file path
 * @param {string} path - The path to check
 * @returns {boolean} - True if likely a local path, false otherwise
 */
export const isLocalPath = (path) => {
  if (!path || typeof path !== 'string') return false;
  // Check if it starts with common local path patterns
  return path.startsWith('/') || 
         path.startsWith('./') || 
         path.startsWith('../') || 
         path.startsWith('src/') || 
         path.match(/^[A-Za-z]:\\/) !== null; // Windows path
};

/**
 * Gets the appropriate image URL with fallback, recursively checking objects
 * @param {any} source - The user object, image path, or nested object
 * @param {string} type - The type of image (user, product, avatar, etc.)
 * @param {number} depth - Current recursion depth (to prevent infinite recursion)
 * @returns {string} - The resolved image URL or fallback image
 */
export const getImageUrl = (source, type = 'default', depth = 0) => {
  // Get the appropriate default image for this type
  const defaultImage = DEFAULT_IMAGES[type] || DEFAULT_IMAGES.default;
  
  // Prevent infinite recursion
  if (depth > 5) return defaultImage;
  
  // If no source provided, return default
  if (!source) return defaultImage;
  
  // If source is a string, check if it's a URL or local path
  if (typeof source === 'string') {
    if (isHttpUrl(source) || isLocalPath(source)) {
      return source;
    }
    return defaultImage;
  }
  
  // If source is an object, check common image properties
  if (typeof source === 'object') {
    // Check common image property names
    const imageProps = ['image', 'avatar', 'profilePicture', 'profileImage', 'photo', 'picture'];
    
    for (const prop of imageProps) {
      if (source[prop]) {
        // Recursively check the property value
        return getImageUrl(source[prop], type, depth + 1);
      }
    }
    
    // If no image property found, check all object properties recursively
    for (const key in source) {
      if (typeof source[key] === 'object' || typeof source[key] === 'string') {
        const result = getImageUrl(source[key], type, depth + 1);
        if (result !== defaultImage) {
          return result;
        }
      }
    }
  }
  
  // If no valid image found, return default
  return defaultImage;
};

/**
 * Convenience function for getting user images
 * @param {any} user - The user object or image path
 * @returns {string} - The resolved image URL or fallback image
 */
export const getUserImageUrl = (user) => {
  return getImageUrl(user, 'user');
};

/**
 * Convenience function for getting product images
 * @param {any} product - The product object or image path
 * @returns {string} - The resolved image URL or fallback image
 */
export const getProductImageUrl = (product) => {
  return getImageUrl(product, 'product');
};

/**
 * React component image error handler
 * @param {Event} e - The error event
 * @param {string} type - The type of image (user, product, avatar, etc.)
 */
export const handleImageError = (e, type = 'default') => {
  e.target.onerror = null; // Prevent infinite loop
  e.target.src = DEFAULT_IMAGES[type] || DEFAULT_IMAGES.default;
};