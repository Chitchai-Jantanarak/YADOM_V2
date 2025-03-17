import type { Request, Response, NextFunction } from "express"
import { prisma } from "../index"
import { ApiError } from "../middleware/errorMiddleware"

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        type: true,
        localUrl: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    const total = await prisma.product.count({
      where: {
        deletedAt: null,
      },
    })

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: {
        id: Number.parseInt(id),
        deletedAt: null,
      },
      include: {
        bones: {
          include: {
            text: true,
          },
        },
      },
    })

    if (!product) {
      return next(ApiError.notFound("Product not found"))
    }

    res.json(product)
  } catch (error) {
    next(error)
  }
}

// @desc    Create a product (admin/owner only)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, price, type, localUrl, bones } = req.body

    // Validate input
    if (!name || !price || !type || !localUrl) {
      return next(ApiError.badRequest("Please provide name, price, type and localUrl"))
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: Number.parseFloat(price),
        type,
        localUrl,
      },
    })

    // Create bones if provided
    if (bones && bones.length > 0) {
      for (const bone of bones) {
        await prisma.bone.create({
          data: {
            productId: product.id,
            name: bone.name,
            defDetail: bone.defDetail || "",
            defaultStyle: bone.defaultStyle,
            isConfiguration: bone.isConfiguration || false,
            textId: bone.textId || null,
          },
        })
      }
    }

    // Get the complete product with bones
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        bones: {
          include: {
            text: true,
          },
        },
      },
    })

    res.status(201).json(completeProduct)
  } catch (error) {
    next(error)
  }
}

// @desc    Update a product (admin/owner only)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { name, description, price, type, localUrl } = req.body

    const product = await prisma.product.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!product) {
      return next(ApiError.notFound("Product not found"))
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number.parseInt(id) },
      data: {
        name: name || product.name,
        description: description !== undefined ? description : product.description,
        price: price ? Number.parseFloat(price) : product.price,
        type: type || product.type,
        localUrl: localUrl || product.localUrl,
      },
    })

    res.json(updatedProduct)
  } catch (error) {
    next(error)
  }
}

// @desc    Delete a product (admin/owner only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!product) {
      return next(ApiError.notFound("Product not found"))
    }

    // Soft delete
    await prisma.product.update({
      where: { id: Number.parseInt(id) },
      data: { deletedAt: new Date() },
    })

    res.json({ message: "Product removed" })
  } catch (error) {
    next(error)
  }
}

