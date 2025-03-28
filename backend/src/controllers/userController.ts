import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../lib/prisma.js"
import { ApiError } from "../middleware/errorMiddleware.js"
import { config } from "../config.js"
import crypto from "crypto"

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, tel, address } = req.body

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
      },
    })

    // Generate token
    const token = generateToken(user.id)

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
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
    const { name, email, password, tel, address } = req.body

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

    // In a real app, you would store this OTP securely, possibly in Redis
    // For this example, we'll use the reset token to verify the OTP later

    // Send email with OTP
    try {
      // In a real app, implement actual email sending
      // await sendEmail({
      //   to: user.email,
      //   subject: "Password Reset Request",
      //   text: `Your OTP for password reset is: ${otp}. This code will expire in 1 hour.`,
      // })

      // For development, just log the OTP
      console.log(`OTP for ${user.email}: ${otp}`)

      res.json({
        message: "Password reset email sent",
        token: resetToken, // Send token to client for verification
      })
    } catch (error) {
      // If email fails, remove reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      })
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

    // In a real app, verify the OTP against what was sent
    // For this example, we'll assume the OTP is valid if the token is valid

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

// Generate JWT
const generateToken = (id: number) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  })
}

