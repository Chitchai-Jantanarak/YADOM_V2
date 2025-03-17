import type { Request, Response, NextFunction } from "express"
import { prisma } from "../index"
import { ApiError } from "../middleware/errorMiddleware"

// @desc    Create an order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
        orderId: null,
        isUsed: true,
        deletedAt: null,
      },
    })

    if (cartItems.length === 0) {
      return next(ApiError.badRequest("No items in cart"))
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        status: "WAITING",
      },
    })

    // Update cart items with order ID
    for (const item of cartItems) {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { orderId: order.id },
      })
    }

    // Get complete order
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        cartItems: {
          include: {
            product: true,
            aroma: true,
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
        },
      },
    })

    res.status(201).json(completeOrder)
  } catch (error) {
    next(error)
  }
}

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        cartItems: {
          include: {
            product: true,
            aroma: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    const total = await prisma.order.count({
      where: { userId },
    })

    res.json({
      orders,
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

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const order = await prisma.order.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        cartItems: {
          include: {
            product: true,
            aroma: true,
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            tel: true,
            address: true,
          },
        },
      },
    })

    if (!order) {
      return next(ApiError.notFound("Order not found"))
    }

    // Check if the user is authorized
    if (req.user.id !== order.userId && req.user.role !== "ADMIN" && req.user.role !== "OWNER") {
      return next(ApiError.forbidden("Not authorized to view this order"))
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
}

// @desc    Update order status (admin/owner only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (!status) {
      return next(ApiError.badRequest("Please provide status"))
    }

    const order = await prisma.order.findUnique({
      where: { id: Number.parseInt(id) },
    })

    if (!order) {
      return next(ApiError.notFound("Order not found"))
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: Number.parseInt(id) },
      data: { status },
    })

    res.json(updatedOrder)
  } catch (error) {
    next(error)
  }
}

// @desc    Get all orders (admin/owner only)
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number.parseInt(req.query.page as string) || 1
    const limit = Number.parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit
    const status = req.query.status as string

    const whereClause: any = {}
    if (status) {
      whereClause.status = status
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    })

    const total = await prisma.order.count({
      where: whereClause,
    })

    res.json({
      orders,
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

