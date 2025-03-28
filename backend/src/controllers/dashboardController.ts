import type { Request, Response, NextFunction } from "express"
import { prisma } from "../lib/prisma.js"

// @desc    Get dashboard statistics (owner only)
// @route   GET /api/dashboard/stats
// @access  Private/Owner
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Total users
    const totalUsers = await prisma.user.count({
      where: { deletedAt: null },
    })

    // Total products
    const totalProducts = await prisma.product.count({
      where: { deletedAt: null },
    })

    // Total orders
    const totalOrders = await prisma.order.count()

    // Revenue
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ["CONFIRMED", "COMPLETED"],
        },
      },
      include: {
        cartItems: true,
      },
    })

    let totalRevenue = 0
    for (const order of orders) {
      for (const item of order.cartItems) {
        totalRevenue += item.price
      }
    }

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
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
    })

    const formattedRecentOrders = recentOrders.map((order) => ({
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

    // Order status counts
    const waitingOrders = await prisma.order.count({
      where: { status: "WAITING" },
    })

    const pendingOrders = await prisma.order.count({
      where: { status: "PENDING" },
    })

    const confirmedOrders = await prisma.order.count({
      where: { status: "CONFIRMED" },
    })

    const completedOrders = await prisma.order.count({
      where: { status: "COMPLETED" },
    })

    const canceledOrders = await prisma.order.count({
      where: { status: "CANCELED" },
    })

    // Monthly sales data for chart
    const currentYear = new Date().getFullYear()
    const monthlySales = []

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1)
      const endDate = new Date(currentYear, month + 1, 0)

      const monthlyOrders = await prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            in: ["CONFIRMED", "COMPLETED"],
          },
        },
        include: {
          cartItems: true,
        },
      })

      let monthlyRevenue = 0
      for (const order of monthlyOrders) {
        for (const item of order.cartItems) {
          monthlyRevenue += item.price
        }
      }

      monthlySales.push({
        month: startDate.toLocaleString("default", { month: "short" }),
        revenue: monthlyRevenue,
        orders: monthlyOrders.length,
      })
    }

    // Get aroma statistics
    const aromas = await prisma.aroma.findMany({
      where: { deletedAt: null },
    })

    const aromaStats = await Promise.all(
      aromas.map(async (aroma) => {
        const count = await prisma.cartItem.count({
          where: {
            aromaId: aroma.id,
            order: {
              status: {
                in: ["CONFIRMED", "COMPLETED"],
              },
            },
          },
        })

        return {
          name: aroma.name,
          count,
        }
      }),
    )

    // Get product type statistics
    const productTypes = ["ACCESSORY", "MAIN_PRODUCT", "UNKNOWN"]

    const productTypeStats = await Promise.all(
      productTypes.map(async (type) => {
        const count = await prisma.product.count({
          where: {
            type,
            deletedAt: null,
          },
        })

        const revenue = await prisma.cartItem.aggregate({
          _sum: {
            price: true,
          },
          where: {
            product: {
              type,
            },
            order: {
              status: {
                in: ["CONFIRMED", "COMPLETED"],
              },
            },
          },
        })

        return {
          type,
          count,
          revenue: revenue._sum.price || 0,
        }
      }),
    )

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders: formattedRecentOrders,
      orderStats: {
        waiting: waitingOrders,
        pending: pendingOrders,
        confirmed: confirmedOrders,
        completed: completedOrders,
        canceled: canceledOrders,
      },
      monthlySales,
      aromaStats: aromaStats.sort((a, b) => b.count - a.count),
      productTypeStats,
    })
  } catch (error) {
    next(error)
  }
}

