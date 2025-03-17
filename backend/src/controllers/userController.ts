import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcrypt"
import { prisma } from "../index"
import { generateToken } from "../utils/generateToken"
import { ApiError } from "../middleware/errorMiddleware"

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, tel, address } = req.body

    // Validate input
    if (!name || !email || !password) {
      return next(ApiError.badRequest("Please provide name, email and password"))
    }

    // Check if user exists
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

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      })
    } else {
      return next(ApiError.internal("Failed to create user"))
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return next(ApiError.badRequest("Please provide email and password"))
    }

    // Check for user email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return next(ApiError.unauthorized("Invalid credentials"))
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return next(ApiError.unauthorized("Invalid credentials"))
    }

    // Update login time
    await prisma.user.update({
      where: { id: user.id },
      data: { loginAt: new Date() },
    })

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
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
        createdAt: true,
      },
    })

    if (user) {
      res.json(user)
    } else {
      return next(ApiError.notFound("User not found"))
    }
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

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      return next(ApiError.notFound("User not found"))
    }

    // Prepare update data
    const updateData: any = {}

    if (name) updateData.name = name
    if (email) updateData.email = email
    if (tel) updateData.tel = tel
    if (address) updateData.address = address

    // If password is provided, hash it
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

