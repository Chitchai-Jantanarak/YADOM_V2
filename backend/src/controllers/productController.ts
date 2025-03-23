import type { Request, Response, NextFunction } from "express"
import { prisma } from "../lib/prisma.js"
import { ApiError } from "../middleware/errorMiddleware.js"
import { ProductType } from "@prisma/client"

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Get type filter if provided
    const type = req.query.type as ProductType | undefined

    // Build where clause
    const where: any = {
      deletedAt: null,
    }

    // Add type filter if provided
    if (type) {
      where.type = type
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        colors: true, // Include colors for ACCESSORY products
        bones:
          type === "MAIN_PRODUCT"
            ? {
                include: {
                  text: true,
                },
              }
            : undefined,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    const total = await prisma.product.count({ where })

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
        colors: true, // Include colors for all products
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
    const { name, description, price, type, localUrl, bones, colors } = req.body

    // Validate input
    if (!name || !price || !type || !localUrl) {
      return next(ApiError.badRequest("Please provide name, price, type and localUrl"))
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: Number.parseFloat(price),
        type,
        localUrl,
      },
    })

    // Create bones if provided (for MAIN_PRODUCT)
    if (bones && bones.length > 0 && type === "MAIN_PRODUCT") {
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

    // Create colors if provided (for ACCESSORY)
    if (colors && Array.isArray(colors) && type === "ACCESSORY") {
      await prisma.productColor.createMany({
        data: colors.map((color) => ({
          colorCode: color.colorCode,
          colorName: color.colorName || null,
          productId: product.id,
        })),
      })
    }

    // Get the complete product with bones and/or colors
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        bones:
          type === "MAIN_PRODUCT"
            ? {
                include: {
                  text: true,
                },
              }
            : undefined,
        colors: type === "ACCESSORY" ? true : undefined,
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
    const { name, description, price, type, localUrl, colors } = req.body

    const product = await prisma.product.findUnique({
      where: { id: Number.parseInt(id) },
      include: { colors: true },
    })

    if (!product) {
      return next(ApiError.notFound("Product not found"))
    }

    // Update the product
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

    // Update colors if provided (for ACCESSORY)
    if (colors && Array.isArray(colors) && (type === "ACCESSORY" || product.type === "ACCESSORY")) {
      // Delete existing colors
      await prisma.productColor.deleteMany({
        where: { productId: Number.parseInt(id) },
      })

      // Create new colors
      await prisma.productColor.createMany({
        data: colors.map((color) => ({
          colorCode: color.colorCode,
          colorName: color.colorName || null,
          productId: Number.parseInt(id),
        })),
      })
    }

    // Get the updated product with all relations
    const completeProduct = await prisma.product.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        bones: {
          include: {
            text: true,
          },
        },
        colors: true,
      },
    })

    res.json(completeProduct)
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

// @desc    Get products by type
// @route   GET /api/products/type/:type
// @access  Public
export const getProductsByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Validate type
    if (!Object.values(ProductType).includes(type as ProductType)) {
      return next(ApiError.badRequest("Invalid product type"))
    }

    const products = await prisma.product.findMany({
      where: {
        type: type as ProductType,
        deletedAt: null,
      },
      include: {
        colors: type === "ACCESSORY",
        bones:
          type === "MAIN_PRODUCT"
            ? {
                include: {
                  text: true,
                },
              }
            : undefined,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    const total = await prisma.product.count({
      where: {
        type: type as ProductType,
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

