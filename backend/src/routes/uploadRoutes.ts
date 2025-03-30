import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import { protect } from "../middleware/authMiddleware.js"
import { prisma } from "../lib/prisma.js"

const router = express.Router()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads")
const profileImagesDir = path.join(uploadsDir, "profile-images")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

if (!fs.existsSync(profileImagesDir)) {
  fs.mkdirSync(profileImagesDir)
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImagesDir)
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueFilename)
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false)
  }
  cb(null, true)
}

// Configure upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
})

// Upload profile image
router.post("/profile-image", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Create URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const fileUrl = `${baseUrl}/uploads/profile-images/${req.file.filename}`

    // Delete old image file if it exists
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { imageUrl: true },
      })

      if (user?.imageUrl) {
        const oldImagePath = new URL(user.imageUrl).pathname
        const fullPath = path.join(process.cwd(), oldImagePath)

        // Check if file exists before attempting to delete
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
          console.log(`Deleted old profile image: ${fullPath}`)
        }
      }
    } catch (error) {
      console.error("Error deleting old image:", error)
      // Continue even if old image deletion fails
    }

    // Update user with new image URL
    await prisma.user.update({
      where: { id: req.user.id },
      data: { imageUrl: fileUrl },
    })

    res.json({
      message: "File uploaded successfully",
      url: fileUrl,
    })
  } catch (error) {
    console.error("Upload error:", error)
    res.status(500).json({ message: "Failed to upload file" })
  }
})

// Get user profile image
router.get("/profile-image/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const user = await prisma.user.findUnique({
      where: { id: Number.parseInt(userId) },
      select: { imageUrl: true },
    })

    if (!user || !user.imageUrl) {
      return res.status(404).json({ message: "Profile image not found" })
    }

    res.json({ url: user.imageUrl })
  } catch (error) {
    console.error("Error fetching profile image:", error)
    res.status(500).json({ message: "Failed to fetch profile image" })
  }
})

export default router

