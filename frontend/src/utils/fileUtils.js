/**
 * Gets the correct asset path based on product type and ID
 * @param {Object} product - The product object
 * @returns {string} - The correct asset path
 */
export const getProductAssetPath = (product) => {
    if (!product || !product.id) return null
  
    if (product.type === "MAIN_PRODUCT") {
      // Use the model{id}.glb naming convention
      return `/src/assets/models/model${product.id}.glb`
    } else if (product.type === "ACCESSORY") {
      return `/src/assets/images/shop/${product.id}.png`
    }
  
    return null
  }
  
  /**
   * Checks if a product has a valid asset path
   * @param {Object} product - The product object
   * @returns {boolean} - Whether the product has a valid asset path
   */
  export const hasValidAssetPath = (product) => {
    return !!getProductAssetPath(product)
  }
  
  /**
   * Gets a fallback asset path based on product type
   * @param {string} productType - The product type (MAIN_PRODUCT or ACCESSORY)
   * @returns {string} - The fallback asset path
   */
  export const getFallbackAssetPath = (productType) => {
    if (productType === "MAIN_PRODUCT") {
      return "/src/assets/models/fallback-model.glb"
    } else if (productType === "ACCESSORY") {
      return "/src/assets/images/placeholder-product.png"
    }
  
    return null
  }
  
  /**
   * Validates if the file is of the correct type for the product
   * @param {File} file - The file to validate
   * @param {string} productType - The product type (MAIN_PRODUCT or ACCESSORY)
   * @returns {Object} - Validation result with success and message
   */
  export const validateProductFile = (file, productType) => {
    if (!file) {
      return { success: false, message: "No file selected" }
    }
  
    const fileName = file.name.toLowerCase()
  
    if (productType === "MAIN_PRODUCT") {
      if (!fileName.endsWith(".glb")) {
        return {
          success: false,
          message: "Invalid file type. Please select a GLB file for 3D models.",
        }
      }
  
      // Check file size (max 50MB for 3D models)
      if (file.size > 50 * 1024 * 1024) {
        return {
          success: false,
          message: "File size exceeds 50MB limit for 3D models.",
        }
      }
    } else if (productType === "ACCESSORY") {
      if (!fileName.endsWith(".png") && !fileName.endsWith(".jpg") && !fileName.endsWith(".jpeg")) {
        return {
          success: false,
          message: "Invalid file type. Please select a PNG, JPG, or JPEG image file for accessories.",
        }
      }
  
      // Check file size (max 2MB for images)
      if (file.size > 2 * 1024 * 1024) {
        return {
          success: false,
          message: "File size exceeds 2MB limit for images.",
        }
      }
    }
  
    return { success: true }
  }
  
  /**
   * Checks if an image exists at the given path
   * @param {string} imagePath - The path to check
   * @returns {Promise<boolean>} - Whether the image exists
   */
  export const checkImageExists = (imagePath) => {
    return new Promise((resolve) => {
      if (!imagePath) {
        resolve(false)
        return
      }
  
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = imagePath
    })
  }
  
  /**
   * Gets a placeholder image path
   * @returns {string} - The placeholder image path
   */
  export const getPlaceholderImagePath = () => {
    return "/src/assets/images/placeholder-product.png"
  }
  
  