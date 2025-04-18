import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import path from "path"
import fs from "fs"
import { prisma } from "../lib/prisma.js"
import { ApiError } from "../middleware/errorMiddleware.js"
import { generateToken } from "../utils/generateToken.js"
import { sendEmail } from "../utils/emailService.js"
import crypto from "crypto"

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, tel, address, imageUrl } = req.body

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    })

    if (userExists) {
      return next(ApiError.badRequest("User already exists"))
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        tel: tel || "",
        address: address || "",
        role: "CUSTOMER", // Default role
        imageUrl: imageUrl || null,
      },
    })

    // Generate token
    const token = generateToken(user.id, user.role)

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl,
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return next(ApiError.unauthorized("User or password is incorrect"))
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return next(ApiError.unauthorized("User or password is incorrect"))
    }

    // Update login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAt: new Date() },
    })

    // Generate token
    const token = generateToken(user.id)

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl,
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        address: true,
        role: true,
        imageUrl: true,
        loginAt: true,
        createdAt: true,
      },
    })

    if (!user) {
      return next(ApiError.notFound("User not found"))
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, tel, address, imageUrl } = req.body

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      return next(ApiError.notFound("User not found"))
    }

    // Update data
    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (tel) updateData.tel = tel
    if (address) updateData.address = address
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(password, salt)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        address: true,
        role: true,
        imageUrl: true,
      },
    })

    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile image
// @route   POST /api/users/profile/image
// @access  Private
export const updateProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(ApiError.badRequest("No image file uploaded"))
    }

    // Create URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get("host")}`
    const fileUrl = `${baseUrl}/uploads/profile-images/${req.file.filename}`

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { imageUrl: true },
    })

    // Delete old image file if it exists
    if (user?.imageUrl) {
      try {
        const oldImagePath = new URL(user.imageUrl).pathname
        const fullPath = path.join(process.cwd(), oldImagePath)

        // Check if file exists before attempting to delete
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath)
          console.log(`Deleted old profile image: ${fullPath}`)
        }
      } catch (error) {
        console.error("Error deleting old image:", error)
        // Continue even if old image deletion fails
      }
    }

    // Update user with new image URL
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { imageUrl: fileUrl },
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        address: true,
        role: true,
        imageUrl: true,
      },
    })

    res.json({
      message: "Profile image updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    console.log(`Password reset requested for email: ${email}`)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log(`User not found for email: ${email}`)
      return next(ApiError.notFound("User not found"))
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex")
    console.log(`Generated reset token for ${email}`)

    // Hash token and set to resetToken field
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`Generated OTP for ${email}: ${otp}`)

    // Hash OTP for storage
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex")

    // Set token expiry (1 hour)
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

    // Update user with reset token and OTP hash
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry,
        otpHash, // Store OTP hash in database
      },
    })
    console.log(`Updated user record with reset token and OTP hash`)

    // Prepare email content with improved design
    const emailContent = {
      to: user.email,
      subject: "ํPassword Reset Verification Code",
      text: `Your verification code for password reset is: ${otp}. This code will expire in 1 hour. If you didn't request this reset, please ignore this message or contact support.`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #3b82f6; margin-bottom: 5px; font-size: 24px;">Password Reset</h1>
            <p style="color: #6b7280; font-size: 16px;">Secure Verification Code</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin-bottom: 10px; font-size: 16px; color: #374151;">Hello,</p>
            <p style="margin-bottom: 20px; font-size: 16px; color: #374151;">We received a request to reset your password. Use the verification code below to complete the process:</p>
            
            <div style="background-color: #ffffff; border: 1px dashed #d1d5db; border-radius: 5px; padding: 15px; text-align: center; margin-bottom: 20px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3b82f6;">${otp}</span>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">This code will expire in 1 hour.</p>
          </div>
          
          <div style="font-size: 14px; color: #6b7280; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <p>For security reasons, please do not share this code with anyone.</p>
          </div>
        </div>
      `,
    }

    try {
      // Send email
      console.log(`Attempting to send email to ${user.email}`)
      await sendEmail(emailContent)
      console.log(`Email sent successfully to ${user.email}`)

      res.json({
        message: "Password reset email sent",
        token: resetToken, // Send token to client for verification
      })
    } catch (error) {
      console.error("Email sending error:", error)

      // Remove reset token if email fails
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
          otpHash: null,
        },
      })

      return next(ApiError.internal(`Failed to send reset email: ${error.message}`))
    }
  } catch (error) {
    console.error("Password reset error:", error)
    next(error)
  }
}

// @desc    Verify OTP for password reset
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, token } = req.body

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.resetToken || !user.resetTokenExpiry || !user.otpHash) {
      return next(ApiError.badRequest("Invalid or expired reset token"))
    }

    // Check if token is expired
    if (user.resetTokenExpiry < new Date()) {
      return next(ApiError.badRequest("Reset token has expired"))
    }

    // Hash the provided token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // Verify token matches
    if (hashedToken !== user.resetToken) {
      return next(ApiError.badRequest("Invalid reset token"))
    }

    // Hash the provided OTP to compare with stored hash
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex")

    // Verify OTP matches
    if (hashedOtp !== user.otpHash) {
      return next(ApiError.badRequest("Invalid OTP"))
    }

    res.json({
      message: "OTP verified successfully",
      token, // Return token for reset password step
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, token } = req.body

    // Hash the provided token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // Find user by email and token
    const user = await prisma.user.findFirst({
      where: {
        email,
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    })

    if (!user) {
      return next(ApiError.badRequest("Invalid or expired reset token"))
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        otpHash: null,
      },
    })

    res.json({ message: "Password reset successful" })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all users (admin only)
// @route   GET /api/users/admin
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        address: true,
        role: true,
        imageUrl: true,
        createdAt: true,
        loginAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(users)
  } catch (error) {
    next(error)
  }
}

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        address: true,
        role: true,
        imageUrl: true,
        createdAt: true,
        loginAt: true,
      },
    })

    if (!user) {
      return next(ApiError.notFound("User not found"))
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, role, tel, address, imageUrl } = req.body

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    })

    if (!user) {
      return next(ApiError.notFound("User not found"))
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (email) updateData.email = email
    if (role) updateData.role = role
    if (tel) updateData.tel = tel
    if (address) updateData.address = address
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        address: true,
        role: true,
        imageUrl: true,
      },
    })

    res.json(updatedUser)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    })

    if (!user) {
      return next(ApiError.notFound("User not found"))
    }

    await prisma.user.delete({
      where: { id: req.params.id },
    })

    res.json({ message: "User removed" })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user orders (admin only)
// @route   GET /api/users/:id/orders
// @access  Private/Admin
export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.id },
      include: {
        cartItems: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json(orders)
  } catch (error) {
    next(error)
  }
}

// @desc    Search users (admin only)
// @route   GET /api/users/search
// @access  Private/Admin
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.query

    if (!query || typeof query !== 'string') {
      return next(ApiError.badRequest("Search query is required"))
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { tel: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        tel: true,
        address: true,
        role: true,
        imageUrl: true,
        createdAt: true,
      },
    })

    res.json(users)
  } catch (error) {
    next(error)
  }
}