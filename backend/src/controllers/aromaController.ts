import type { Request, Response, NextFunction } from "express"
import { prisma } from "../index"
import { ApiError } from "../middleware/errorMiddleware"

// @desc    Get all aromas
// @route   GET /api/aromas
// @access  Public
export const getAromas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const aromas = await prisma.aroma.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    })

    res.json(aromas)
  } catch (error) {
    next(error)
  }
}

// @desc    Get aroma by ID
// @route   GET /api/aromas/:id
// @access  Public
export const getAromaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const aroma = await prisma.aroma.findUnique({
      where: {
        id: Number.parseInt(id),
        deletedAt: null,
      },
    })

    if (!aroma) {
      return next(ApiError.notFound("Aroma not found"))
    }

    res.json(aroma)
  } catch (error) {
    next(error)
  }
}

// @desc    Create aroma
// @route   POST /api/aromas
// @access  Private/Admin
export const createAroma = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price } = req.body

    if (!name || !price) {
      return next(ApiError.badRequest("Name and price are required"))
    }

    const aroma = await prisma.aroma.create({
      data: {
        name,
        description: description || "",
        price: Number.parseFloat(price),
      },
    })

    res.status(201).json(aroma)
  } catch (error) {
    next(error)
  }
}

// @desc    Update aroma
// @route   PUT /api/aromas/:id
// @access  Private/Admin
export const updateAroma = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, description, price } = req.body

    const aroma = await prisma.aroma.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!aroma) {
      return next(ApiError.notFound("Aroma not found"))
    }

    const updatedAroma = await prisma.aroma.update({
      where: { id: Number.parseInt(id) },
      data: {
        name: name || aroma.name,
        description: description !== undefined ? description : aroma.description,
        price: price ? Number.parseFloat(price) : aroma.price,
      },
    })

    res.json(updatedAroma)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete aroma
// @route   DELETE /api/aromas/:id
// @access  Private/Admin
export const deleteAroma = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const aroma = await prisma.aroma.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!aroma) {
      return next(ApiError.notFound("Aroma not found"))
    }

    // Soft delete
    await prisma.aroma.update({
      where: { id: Number.parseInt(id) },
      data: { deletedAt: new Date() },
    })

    res.json({ message: "Aroma removed" })
  } catch (error) {
    next(error)
  }
}

