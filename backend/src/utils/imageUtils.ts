import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

/**
 * Utility functions for handling images
 */
export const imageUtils = {
  /**
   * Delete an image file by URL
   * @param imageUrl - The URL of the image to delete
   * @returns boolean - Whether the deletion was successful
   */
  deleteImageByUrl: (imageUrl: string): boolean => {
    try {
      if (!imageUrl) return false

      // Extract the path from the URL
      const urlObj = new URL(imageUrl)
      const imagePath = urlObj.pathname

      // Get the full path to the file
      const fullPath = path.join(process.cwd(), imagePath)

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        console.log(`Image file not found: ${fullPath}`)
        return false
      }

      // Delete the file
      fs.unlinkSync(fullPath)
      console.log(`Deleted image: ${fullPath}`)
      return true
    } catch (error) {
      console.error("Error deleting image:", error)
      return false
    }
  },

  /**
   * Generate a unique filename for an image
   * @param originalFilename - The original filename
   * @returns string - A unique filename
   */
  generateUniqueFilename: (originalFilename: string): string => {
    const extension = path.extname(originalFilename)
    return `${uuidv4()}${extension}`
  },

  /**
   * Validate if a file is an image
   * @param file - The file to validate
   * @returns boolean - Whether the file is a valid image
   */
  isValidImage: (file: Express.Multer.File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"]
    return validTypes.includes(file.mimetype)
  },

  /**
   * Get the URL for an image
   * @param req - Express request object
   * @param filename - The filename of the image
   * @param subdir - Optional subdirectory within uploads
   * @returns string - The full URL to the image
   */
  getImageUrl: (req: any, filename: string, subdir = "profile-images"): string => {
    const baseUrl = `${req.protocol}://${req.get("host")}`
    return `${baseUrl}/uploads/${subdir}/${filename}`
  },
}

