import type { Request, Response, NextFunction } from "express"
import { prisma } from "../lib/prisma.js"
import { ApiError } from "../middleware/errorMiddleware.js"

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public/Private
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      productId,
      aromaId,
      userId,
      modifiedBoneGroupId,
      quantity,
      productColorId,
      selectedColor, // For backward compatibility
      price,
    } = req.body

    // If user is authenticated, use their ID, otherwise use the provided one
    const actualUserId = req.user ? req.user.id : userId

    if (!actualUserId) {
      return next(ApiError.badRequest("User ID is required"))
    }

    if (!productId) {
      return next(ApiError.badRequest("Product ID is required"))
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        colors: true, // Include colors to handle selectedColor if needed
      },
    })

    if (!product) {
      return next(ApiError.notFound("Product not found"))
    }

    // Calculate price if not provided
    let finalPrice = price
    if (!finalPrice) {
      let basePrice = product.price

      // Add aroma price if applicable
      if (aromaId) {
        const aroma = await prisma.aroma.findUnique({
          where: { id: aromaId },
        })

        if (aroma) {
          basePrice += aroma.price
        }
      }

      // Multiply by quantity
      finalPrice = basePrice * (quantity || 1)
    }

    // Handle color selection
    let finalProductColorId = productColorId

    // For backward compatibility: if productColorId is not provided but selectedColor is
    if (!finalProductColorId && selectedColor && product.type === "ACCESSORY") {
      // If selectedColor is a string (color code), try to find the matching ProductColor
      if (typeof selectedColor === "string" && product.colors && product.colors.length > 0) {
        const matchingColor = product.colors.find((c) => c.colorCode === selectedColor)
        if (matchingColor) {
          finalProductColorId = matchingColor.id
        }
      }
      // If selectedColor is a number, assume it's already a ProductColor ID
      else if (typeof selectedColor === "number") {
        finalProductColorId = selectedColor
      }
    }

    // Create cart item
    const cartItem = await prisma.cartItem.create({
      data: {
        productId,
        aromaId: aromaId || null,
        userId: actualUserId,
        modifiedBoneGroupId: modifiedBoneGroupId || null,
        productColorId: finalProductColorId || null,
        price: finalPrice,
        quantity: quantity || 1,
        isUsed: true,
      },
    })

    // Get complete cart item with related data
    const completeCartItem = await prisma.cartItem.findUnique({
      where: { id: cartItem.id },
      include: {
        product: true,
        aroma: true,
        productColor: true,
        modifiedBoneGroup: {
          include: {
            modifiedBones: {
              include: {
                bone: true,
              },
            },
          },
        },
      },
    })

    res.status(201).json(completeCartItem)
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
        orderId: null,
        isUsed: true,
        deletedAt: null,
      },
      include: {
        product: true,
        aroma: true,
        productColor: true, // Include the productColor relation
        modifiedBoneGroup: {
          include: {
            modifiedBones: {
              include: {
                bone: true,
              },
            },
          },
        },
      },
    })

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.price, 0)

    res.json({
      cartItems,
      total,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update cart item
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { quantity, productColorId } = req.body

    if (!quantity || quantity < 1) {
      return next(ApiError.badRequest("Quantity must be at least 1"))
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        product: true,
        aroma: true,
      },
    })

    if (!cartItem) {
      return next(ApiError.notFound("Cart item not found"))
    }

    // Check if the user is authorized
    if (req.user.id !== cartItem.userId) {
      return next(ApiError.forbidden("Not authorized to update this cart item"))
    }

    // Calculate new price
    let price = cartItem.product.price

    // Add aroma price if applicable
    if (cartItem.aroma) {
      price += cartItem.aroma.price
    }

    // Multiply by new quantity
    price *= quantity

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: Number.parseInt(id) },
      data: {
        quantity,
        price,
        productColorId: productColorId !== undefined ? productColorId : undefined,
      },
      include: {
        product: true,
        aroma: true,
        productColor: true, // Include the productColor relation
        modifiedBoneGroup: {
          include: {
            modifiedBones: {
              include: {
                bone: true,
              },
            },
          },
        },
      },
    })

    res.json(updatedCartItem)
  } catch (error) {
    next(error)
  }
}

// @desc    Remove cart item
// @route   DELETE /api/cart/:id
// @access  Private
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!cartItem) {
      return next(ApiError.notFound("Cart item not found"))
    }

    // Check if the user is authorized
    if (req.user.id !== cartItem.userId) {
      return next(ApiError.forbidden("Not authorized to remove this cart item"))
    }

    // Soft delete
    await prisma.cartItem.update({
      where: { id: Number.parseInt(id) },
      data: { deletedAt: new Date() },
    })

    res.json({ message: "Cart item removed" })
  } catch (error) {
    next(error)
  }
}

