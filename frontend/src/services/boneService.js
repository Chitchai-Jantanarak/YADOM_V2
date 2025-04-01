/**
 * Maps mesh names to actual bone IDs from the database
 * @param {Array} modifiedBones - Array of modified bones with mesh names as boneId
 * @param {Array} productBones - Array of bones from the database
 * @returns {Array} - Array of modified bones with correct bone IDs
 */
export const mapMeshNamesToBoneIds = (modifiedBones, productBones) => {
    if (!productBones || productBones.length === 0) {
      console.warn("No product bones available for mapping")
      return modifiedBones
    }
  
    return modifiedBones.map((bone) => {
      // Convert boneId to string for comparison if it's not already a string
      const meshName = typeof bone.boneId === "string" ? bone.boneId : String(bone.boneId)
  
      // Try to find a matching bone by name
      const matchingBone = productBones.find(
        (productBone) => productBone.name && productBone.name.toLowerCase() === meshName.toLowerCase(),
        )
  
      if (matchingBone) {
        return {
          ...bone,
          boneId: matchingBone.id, // Use the actual bone ID from the database
        }
      }  
  
      // If no match is found, log a warning and use the first bone as fallback
      console.warn(`No matching bone found for mesh: ${meshName}`)
      return productBones.length > 0 ? { ...bone, boneId: productBones[0].id } : bone
    })
} 
  
  