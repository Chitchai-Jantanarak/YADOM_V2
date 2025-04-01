import type { Request, Response, NextFunction } from "express"
import { prisma } from "../lib/prisma.js"
import { ApiError } from "../middleware/errorMiddleware.js"
import { Prisma } from "@prisma/client"

// Helper function to safely parse IDs
const parseId = (id: string): number => {
  try {
    const parsedId = Number.parseInt(id, 10)
    if (isNaN(parsedId)) {
      throw new Error(`Invalid ID format: ${id}`)
    }
    return parsedId
  } catch (error) {
    console.error(`Error parsing ID: ${id}`, error)
    throw ApiError.badRequest(`Invalid ID format: ${id}`)
  }
}

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

    // Update cart items with order ID and set isUsed to false
    for (const item of cartItems) {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: {
          orderId: order.id,
          isUsed: false,
        },
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
    console.error("Error in createOrder:", error)
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
    console.error("Error in getUserOrders:", error)
    next(error)
  }
}

// @desc    Get recent orders (admin/owner only)
// @route   GET /api/orders/recent
// @access  Private/Admin
export const getRecentOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Getting recent orders")
    const { limit = 10 } = req.query

    const orders = await prisma.order.findMany({
      take: Number.parseInt(limit as string),
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            tel: true,
            address: true,
          },
        },
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
    })

    // Format the orders to match the expected structure
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      user: order.user,
      cartItems: order.cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        aroma: item.aroma ? item.aroma.name : null,
      })),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      total: order.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }))

    res.json(formattedOrders)
  } catch (error) {
    console.error("Error in getRecentOrders:", error)
    next(error)
  }
}

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Skip this function if the ID is "recent" - this is a fallback in case route ordering doesn't work
    if (id === "recent") {
      console.log("Skipping getOrderById for 'recent', this should be handled by getRecentOrders")
      return next()
    }

    console.log(`Fetching order with ID: ${id}`)

    // Parse and validate the ID
    let orderId: number
    try {
      orderId = parseId(id)
      console.log(`Parsed order ID: ${orderId}`)
    } catch (error) {
      return next(error)
    }

    try {
      const order = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
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
        console.log(`Order with ID ${orderId} not found`)
        return next(ApiError.notFound("Order not found"))
      }

      // Check if the user is authorized
      if (req.user.id !== order.userId && req.user.role !== "ADMIN" && req.user.role !== "OWNER") {
        return next(ApiError.forbidden("Not authorized to view this order"))
      }

      res.json(order)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error(`Prisma error in getOrderById: ${error.code}`, error)
        if (error.code === "P2023") {
          return next(ApiError.badRequest("Invalid ID format"))
        }
      }
      throw error
    }
  } catch (error) {
    console.error("Error in getOrderById:", error)
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

    // Parse and validate the ID
    let orderId: number
    try {
      orderId = parseId(id)
    } catch (error) {
      return next(error)
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return next(ApiError.notFound("Order not found"))
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        user: true,
        cartItems: {
          include: {
            product: true,
            aroma: true,
          },
        },
      },
    })

    const subtotal = updatedOrder.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const formattedOrder = {
      id: updatedOrder.id,
      userId: updatedOrder.userId,
      user: updatedOrder.user,
      cartItems: updatedOrder.cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        aroma: item.aroma ? item.aroma.name : null,
      })),
      status: updatedOrder.status,
      createdAt: updatedOrder.createdAt.toISOString(),
      updatedAt: updatedOrder.updatedAt.toISOString(),
      subtotal: subtotal,
      total: subtotal,
    }

    res.json({
      success: true,
      message: `Order ${id} updated to ${status}`,
      order: formattedOrder,
    })
  } catch (error) {
    console.error("Error in updateOrderStatus:", error)
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

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: whereClause }),
    ])

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      user: order.user,
      cartItems: order.cartItems.map((item) => ({
        id: item.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        aroma: item.aroma ? item.aroma.name : null,
        customization: item.modifiedBoneGroup
          ? {
              id: item.modifiedBoneGroup.id,
              bones: item.modifiedBoneGroup.modifiedBones.map((mb) => ({
                name: mb.bone.name,
                style: mb.bone.defaultStyle,
                details: mb.modDetail,
              })),
            }
          : null,
      })),
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      total: order.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }))

    res.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error in getAllOrders:", error)
    next(error)
  }
}

// @desc    Delete order (admin/owner only)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Parse and validate the ID
    let orderId: number
    try {
      orderId = parseId(id)
    } catch (error) {
      return next(error)
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return next(ApiError.notFound("Order not found"))
    }

    await prisma.order.delete({
      where: { id: orderId },
    })

    res.json({
      success: true,
      message: `Order ${id} deleted successfully`,
    })
  } catch (error) {
    console.error("Error in deleteOrder:", error)
    next(error)
  }
}

// @desc    Confirm order payment (customer only)
// @route   POST /api/orders/:id/payment
// @access  Private
export const confirmOrderPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Parse and validate the ID
    let orderId: number
    try {
      orderId = parseId(id)
    } catch (error) {
      return next(error)
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return next(ApiError.notFound("Order not found"))
    }

    // Check if the user is authorized (must be the order owner)
    if (req.user.id !== order.userId) {
      return next(ApiError.forbidden("Not authorized to update this order"))
    }

    // Check if the order is in WAITING status
    if (order.status !== "WAITING") {
      return next(ApiError.badRequest("Order is not in WAITING status"))
    }

    // Update order status to PENDING
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PENDING",
        updatedAt: new Date(),
      },
      include: {
        user: true,
        cartItems: {
          include: {
            product: true,
            aroma: true,
          },
        },
      },
    })

    const subtotal = updatedOrder.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const formattedOrder = {
      id: updatedOrder.id,
      userId: updatedOrder.userId,
      user: updatedOrder.user,
      cartItems: updatedOrder.cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        aroma: item.aroma ? item.aroma.name : null,
      })),
      status: updatedOrder.status,
      createdAt: updatedOrder.createdAt.toISOString(),
      updatedAt: updatedOrder.updatedAt.toISOString(),
      subtotal: subtotal,
      total: subtotal,
    }

    res.json({
      success: true,
      message: `Payment confirmed for order ${id}`,
      order: formattedOrder,
    })
  } catch (error) {
    console.error("Error in confirmOrderPayment:", error)
    next(error)
  }
}