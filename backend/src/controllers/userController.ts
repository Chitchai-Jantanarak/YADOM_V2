import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import { ApiError } from "../middleware/errorMiddleware.js"
import { generateToken } from "../utils/generateToken.js"
import { sendEmail } from "../utils/emailService.js"
import { redis } from "../utils/redisUtil.js"
import { config } from "../config.js"
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

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return next(ApiError.notFound("User not found"))
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // Hash token and set to resetToken field
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")

    // Set token expiry (1 hour)
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetTokenHash,
        resetTokenExpiry,
      },
    })

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // await redis.set(`reset_otp:${user.id}`, otp, 3600)

    // Send email with OTP
    try {
      // Implement actual email sending
      // await sendEmail({
      //   to: user.email,
      //   subject: "Password Reset Request",
      //   text: `Your OTP for password reset is: ${otp}. This code will expire in 1 hour.`,
      //   html: `
      //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      //       <h2>Password Reset Request</h2>
      //       <p>You requested a password reset for your account.</p>
      //       <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      //       <p>This code will expire in 1 hour.</p>
      //       <p>If you didn't request this, please ignore this email.</p>
      //     </div>
      //   `,
      // })

      res.json({
        message: "Password reset email sent",
        token: resetToken, // Send token to client for verification
      })
    } catch (error) {
      console.error("Email sending error:", error)

      // If email fails, remove reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      })

      // Also remove OTP from Redis
      // await redis.del(`reset_otp:${user.id}`)

      return next(ApiError.internal("Failed to send reset email"))
    }
  } catch (error) {
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

    if (!user || !user.resetToken || !user.resetTokenExpiry) {
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

    // Verify OTP against what was stored in Redis
    // const storedOtp = await redis.get(`reset_otp:${user.id}`)
    // if (!storedOtp || storedOtp !== otp) {
    //   return next(ApiError.badRequest("Invalid or expired OTP"))
    // }
    // await redis.del(`reset_otp:${user.id}`)

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