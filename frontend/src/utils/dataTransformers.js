/**
 * Transform a single product from backend format to frontend format
 * @param {Object} product - The product from the backend
 * @returns {Object} - Transformed product for frontend
 */
export const transformProduct = (product) => {
  if (!product) return null

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    type: product.type,
    // Keep the original localUrl for compatibility with fileUtils
    localUrl: product.localUrl,
    // Extract colors from ProductColor objects
    colors: product.colors && Array.isArray(product.colors) ? product.colors.map((color) => color.colorCode) : [],
    // Include bones for MAIN_PRODUCT if available
    bones: product.bones || [],
  }
}

/**
 * Transform an array of products from backend format to frontend format
 * @param {Array} products - Array of products from the backend
 * @returns {Array} - Transformed products for frontend
 */
export const transformProducts = (products) => {
  if (!products || !Array.isArray(products)) return []

  return products.map(transformProduct)
}

