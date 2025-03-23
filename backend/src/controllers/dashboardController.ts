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
          },
        },
      },
    })

    // Order status counts
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

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      orderStats: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        completed: completedOrders,
        canceled: canceledOrders,
      },
      monthlySales,
    })
  } catch (error) {
    next(error)
  }
}

