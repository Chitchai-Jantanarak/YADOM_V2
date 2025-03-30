"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { format, subDays, subMonths, subQuarters, subYears, isValid } from "date-fns"
import {
  DollarSign,
  Download,
  FileText,
  FileSpreadsheet,
  ChevronDown,
  Users,
  ShoppingBag,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

// Import services
import { getAllOrders } from "../../services/orderService"
import { getAllUsers } from "../../services/userService"
import { getProducts } from "../../services/productService"
import { getAromas } from "../../services/aromaService"
import { getDashboardStats } from "../../services/dashboardService"
import { ROLES } from "../../services/authService"
import ProtectedRoute from "../../hoc/ProtectedRoute"

// Chart libraries
import { ResponsiveBar } from "@nivo/bar"
import { ResponsivePie } from "@nivo/pie"
import ReactApexChart from "react-apexcharts"
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Export utilities - removed PDF exports
import { exportToCSV, prepareAnalyticsDataForExport, exportToExcelCSV } from "../../utils/exportUtils"

/**
 * DashboardAnalytics Component
 *
 * This component displays analytics data for the Yadomm dashboard.
 * It fetches data from multiple services and processes it based on the selected time range.
 *
 * @returns {JSX.Element} The rendered dashboard analytics component
 */
const DashboardAnalytics = () => {
  // Refs
  const dashboardRef = useRef(null)
  const exportDropdownRef = useRef(null)

  // State for raw data
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [aromas, setAromas] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)

  // State for UI
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState("month") // month, quarter, half-year, year
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview") // overview, sales, customers, products

  // State for processed analytics data
  const [analyticsData, setAnalyticsData] = useState(null)

  /**
   * Fetches all required data from the API
   * Uses Promise.all to fetch data in parallel for better performance
   */
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)

        // Fetch all data in parallel
        const [ordersData, usersData, productsData, aromasData, statsData] = await Promise.all([
          getAllOrders(),
          getAllUsers(),
          getProducts(),
          getAromas(),
          getDashboardStats(),
        ])

        // Set raw data
        setOrders(Array.isArray(ordersData) ? ordersData : ordersData?.orders || [])
        setUsers(Array.isArray(usersData) ? usersData : usersData?.users || [])
        setProducts(Array.isArray(productsData) ? productsData : productsData?.products || [])
        setAromas(Array.isArray(aromasData) ? aromasData : aromasData?.aromas || [])
        setDashboardStats(statsData || null)

        setError(null)
      } catch (err) {
        console.error("Error fetching analytics data:", err)
        setError("Failed to load analytics data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  /**
   * Process data when raw data or time range changes
   * This effect is triggered whenever the raw data or time range changes
   */
  useEffect(() => {
    if (orders.length && users.length && products.length) {
      processAnalyticsData()
    }
  }, [orders, users, products, aromas, timeRange, dashboardStats])

  /**
   * Handle click outside dropdown
   * Closes the export dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target) &&
        !event.target.closest('[data-export-button="true"]')
      ) {
        setExportDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  /**
   * Process raw data into analytics data based on selected time range
   * This function transforms the raw API data into the format needed for charts and displays
   */
  const processAnalyticsData = () => {
    // Get date range based on selected time period
    const now = new Date()
    let startDate = new Date()

    switch (timeRange) {
      case "month":
        startDate = subMonths(now, 1)
        break
      case "quarter":
        startDate = subQuarters(now, 1)
        break
      case "half-year":
        startDate = subMonths(now, 6)
        break
      case "year":
        startDate = subYears(now, 1)
        break
      default:
        startDate = subMonths(now, 1)
    }

    // Filter orders by date range
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return isValid(orderDate) && orderDate >= startDate && orderDate <= now
    })

    // Calculate total revenue
    const totalRevenue = filteredOrders.reduce((sum, order) => {
      // Calculate order total based on cart items
      const orderTotal = order.cartItems
        ? order.cartItems.reduce((itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 1), 0)
        : order.totalAmount || 0 // Fallback to totalAmount if available
      return sum + orderTotal
    }, 0)

    // Count orders by status
    const orderStats = {
      waiting: filteredOrders.filter((order) => order.status === "WAITING").length,
      pending: filteredOrders.filter((order) => order.status === "PENDING").length,
      confirmed: filteredOrders.filter((order) => order.status === "CONFIRMED").length,
      completed: filteredOrders.filter((order) => order.status === "COMPLETED").length,
      canceled: filteredOrders.filter((order) => order.status === "CANCELED").length,
    }

    // Calculate new users in the period
    const newUsers = users.filter((user) => {
      const userDate = new Date(user.createdAt)
      return isValid(userDate) && userDate >= startDate && userDate <= now
    }).length

    // Generate sales data by day/week/month based on time range
    let salesData = []

    if (timeRange === "month") {
      // Daily data for the last month
      // Create a map for each day in the last month
      const daysMap = new Map()
      for (let i = 0; i < 30; i++) {
        const date = subDays(now, i)
        const dayKey = format(date, "dd")
        daysMap.set(dayKey, { day: dayKey, value: 0 })
      }

      // Fill in the sales data
      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt)
        if (isValid(orderDate)) {
          const dayKey = format(orderDate, "dd")

          if (daysMap.has(dayKey)) {
            const dayData = daysMap.get(dayKey)
            const orderTotal = order.cartItems
              ? order.cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
              : order.totalAmount || 0
            dayData.value += orderTotal
          }
        }
      })

      salesData = Array.from(daysMap.values())
        .sort((a, b) => Number.parseInt(a.day) - Number.parseInt(b.day))
        .slice(0, 7) // Get only the last 7 days
    } else if (timeRange === "quarter") {
      // Weekly data for the last quarter
      const weeksMap = new Map()
      for (let i = 0; i < 12; i++) {
        const weekStart = subDays(now, i * 7)
        const weekKey = `Week ${i + 1}`
        weeksMap.set(weekKey, { week: weekKey, value: 0 })
      }

      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt)
        if (isValid(orderDate)) {
          const weekDiff = Math.floor((now - orderDate) / (7 * 24 * 60 * 60 * 1000))

          if (weekDiff < 12) {
            const weekKey = `Week ${weekDiff + 1}`
            if (weeksMap.has(weekKey)) {
              const weekData = weeksMap.get(weekKey)
              const orderTotal = order.cartItems
                ? order.cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
                : order.totalAmount || 0
              weekData.value += orderTotal
            }
          }
        }
      })

      salesData = Array.from(weeksMap.values()).reverse()
    } else {
      // Monthly data for half-year or year
      const monthsMap = new Map()
      const monthCount = timeRange === "half-year" ? 6 : 12

      for (let i = 0; i < monthCount; i++) {
        const monthDate = subMonths(now, i)
        const monthKey = format(monthDate, "MMM")
        monthsMap.set(monthKey, { month: monthKey, value: 0 })
      }

      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt)
        if (isValid(orderDate)) {
          const monthKey = format(orderDate, "MMM")

          if (monthsMap.has(monthKey)) {
            const monthData = monthsMap.get(monthKey)
            const orderTotal = order.cartItems
              ? order.cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
              : order.totalAmount || 0
            monthData.value += orderTotal
          }
        }
      })

      salesData = Array.from(monthsMap.values()).reverse()
    }

    // Calculate revenue trend data
    let revenueTrendData = []

    if (timeRange === "month") {
      // Daily revenue for the last month
      const daysMap = new Map()
      for (let i = 0; i < 30; i++) {
        const date = subDays(now, i)
        const dayKey = format(date, "dd")
        daysMap.set(dayKey, { x: dayKey, y: 0 })
      }

      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt)
        if (isValid(orderDate)) {
          const dayKey = format(orderDate, "dd")

          if (daysMap.has(dayKey)) {
            const dayData = daysMap.get(dayKey)
            const orderTotal = order.cartItems
              ? order.cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
              : order.totalAmount || 0
            dayData.y += orderTotal
          }
        }
      })

      revenueTrendData = [
        {
          id: "revenue",
          color: "#34a887",
          data: Array.from(daysMap.values())
            .sort((a, b) => Number.parseInt(a.x) - Number.parseInt(b.x))
            .slice(0, 14) // Last 14 days
            .reverse(),
        },
      ]
    } else {
      // Monthly revenue for quarter, half-year, or year
      const monthsMap = new Map()
      const monthCount = timeRange === "quarter" ? 3 : timeRange === "half-year" ? 6 : 12

      for (let i = 0; i < monthCount; i++) {
        const monthDate = subMonths(now, i)
        const monthKey = format(monthDate, "MMM")
        monthsMap.set(monthKey, { x: monthKey, y: 0 })
      }

      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt)
        if (isValid(orderDate)) {
          const monthKey = format(orderDate, "MMM")

          if (monthsMap.has(monthKey)) {
            const monthData = monthsMap.get(monthKey)
            const orderTotal = order.cartItems
              ? order.cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
              : order.totalAmount || 0
            monthData.y += orderTotal
          }
        }
      })

      revenueTrendData = [
        {
          id: "revenue",
          color: "#34a887",
          data: Array.from(monthsMap.values()).reverse(),
        },
      ]
    }

    // Calculate profit percentage change
    // For this example, we'll use a simple calculation comparing current period to previous period
    let previousPeriodStart = new Date(startDate)
    const previousPeriodEnd = new Date(startDate)

    switch (timeRange) {
      case "month":
        previousPeriodStart = subMonths(previousPeriodStart, 1)
        break
      case "quarter":
        previousPeriodStart = subQuarters(previousPeriodStart, 1)
        break
      case "half-year":
        previousPeriodStart = subMonths(previousPeriodStart, 6)
        break
      case "year":
        previousPeriodStart = subYears(previousPeriodStart, 1)
        break
    }

    const previousPeriodOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return isValid(orderDate) && orderDate >= previousPeriodStart && orderDate < startDate
    })

    const previousPeriodRevenue = previousPeriodOrders.reduce((sum, order) => {
      const orderTotal = order.cartItems
        ? order.cartItems.reduce((itemSum, item) => itemSum + (item.price || 0) * (item.quantity || 1), 0)
        : order.totalAmount || 0
      return sum + orderTotal
    }, 0)

    let profitPercentageChange = 0
    if (previousPeriodRevenue > 0) {
      profitPercentageChange = ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
    } else if (totalRevenue > 0) {
      profitPercentageChange = 100 // If previous period had no revenue but current does
    }

    // Round to 2 decimal places
    profitPercentageChange = Math.round(profitPercentageChange * 100) / 100

    // Aroma popularity data
    const aromaStats = []
    if (aromas.length > 0) {
      const aromaCountMap = new Map()

      // Initialize with all aromas
      aromas.forEach((aroma) => {
        aromaCountMap.set(aroma.id, { id: aroma.id, name: aroma.name, count: 0 })
      })

      // Count aroma usage in orders
      filteredOrders.forEach((order) => {
        if (order.cartItems) {
          order.cartItems.forEach((item) => {
            if (item.aromaId && aromaCountMap.has(item.aromaId)) {
              const aromaData = aromaCountMap.get(item.aromaId)
              aromaData.count += item.quantity || 1
            }
          })
        }
      })

      // Convert to array and sort by count
      aromaStats.push(
        ...Array.from(aromaCountMap.values())
          .filter((aroma) => aroma.count > 0)
          .sort((a, b) => b.count - a.count),
      )
    }

    // Calculate daily order counts for the last 30 days
    const dailyOrderCounts = []
    const dailyOrderMap = new Map()

    for (let i = 0; i < 30; i++) {
      const date = subDays(now, i)
      const dateKey = format(date, "yyyy-MM-dd")
      dailyOrderMap.set(dateKey, { date: dateKey, count: 0 })
    }

    filteredOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt)
      if (isValid(orderDate)) {
        const dateKey = format(orderDate, "yyyy-MM-dd")
        if (dailyOrderMap.has(dateKey)) {
          const dayData = dailyOrderMap.get(dateKey)
          dayData.count += 1
        }
      }
    })

    dailyOrderCounts.push(...Array.from(dailyOrderMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date)))

    // Calculate product popularity
    const productStats = []
    if (products.length > 0) {
      const productCountMap = new Map()

      // Initialize with all products
      products.forEach((product) => {
        productCountMap.set(product.id, {
          id: product.id,
          name: product.name,
          count: 0,
          revenue: 0,
        })
      })

      // Count product usage in orders
      filteredOrders.forEach((order) => {
        if (order.cartItems) {
          order.cartItems.forEach((item) => {
            if (item.productId && productCountMap.has(item.productId)) {
              const productData = productCountMap.get(item.productId)
              productData.count += item.quantity || 1
              productData.revenue += (item.price || 0) * (item.quantity || 1)
            }
          })
        }
      })

      // Convert to array and sort by count
      productStats.push(
        ...Array.from(productCountMap.values())
          .filter((product) => product.count > 0)
          .sort((a, b) => b.count - a.count),
      )
    }

    const totalOrders = filteredOrders.length

    // Set the processed analytics data
    setAnalyticsData({
      totalRevenue,
      orderStats,
      newUsers,
      salesData,
      revenueTrendData,
      profitPercentageChange,
      aromaStats,
      totalOrders,
      dailyOrderCounts,
      productStats,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      // Include dashboard stats if available
      ...(dashboardStats || {}),
    })
  }

  /**
   * Format currency with Thai Baht (THB)
   * @param {number} value - The value to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace("฿", "THB")
  }

  /**
   * Prepare order status data for pie chart
   * @returns {Array} Array of objects with order status data
   */
  const getOrderStatusData = () => {
    if (!analyticsData || !analyticsData.orderStats) return []

    const { orderStats } = analyticsData
    const total = Object.values(orderStats).reduce((sum, val) => sum + val, 0)

    if (total === 0) return []

    return [
      {
        id: "Completed",
        label: "Completed",
        value: orderStats.completed,
        percentage: ((orderStats.completed / total) * 100).toFixed(2),
        color: "#34a887",
      },
      {
        id: "Canceled",
        label: "Canceled",
        value: orderStats.canceled,
        percentage: ((orderStats.canceled / total) * 100).toFixed(2),
        color: "#e00303",
      },
      {
        id: "Confirmed",
        label: "Confirmed",
        value: orderStats.confirmed,
        percentage: ((orderStats.confirmed / total) * 100).toFixed(2),
        color: "#0c9df8",
      },
      {
        id: "Waiting",
        label: "Waiting",
        value: orderStats.waiting,
        percentage: ((orderStats.waiting / total) * 100).toFixed(2),
        color: "#ff8d3b",
      },
      {
        id: "Pending",
        label: "Pending",
        value: orderStats.pending,
        percentage: ((orderStats.pending / total) * 100).toFixed(2),
        color: "#131212",
      },
    ]
  }

  /**
   * Get time range label for display and export
   * @returns {string} Formatted time range label
   */
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "month":
        return "Monthly"
      case "quarter":
        return "Quarterly"
      case "half-year":
        return "Half-Yearly"
      case "year":
        return "Yearly"
      default:
        return "Monthly"
    }
  }

  /**
   * Handle export of analytics data in different formats
   * @param {string} format - The export format (csv, excel)
   */
  const handleExport = (format) => {
    if (!analyticsData) return

    const exportData = prepareAnalyticsDataForExport(analyticsData, timeRange)
    const timeRangeText = getTimeRangeLabel()
    const filename = `Yadomm_Analytics_${timeRangeText}`

    switch (format) {
      case "csv":
        // Export summary
        exportToCSV(exportData.summary, `${filename}_Summary`)
        // Export sales data
        exportToCSV(exportData.salesData, `${filename}_Sales`)
        // Export aroma data if available
        if (exportData.aromaData.length > 0) {
          exportToCSV(exportData.aromaData, `${filename}_Aroma_Popularity`)
        }
        // Export product data if available
        if (exportData.productData.length > 0) {
          exportToCSV(exportData.productData, `${filename}_Product_Performance`)
        }
        break
      case "excel":
        // Use our safer alternative to xlsx
        const sheets = [
          { name: "Summary", data: exportData.summary },
          { name: "Sales_Data", data: exportData.salesData },
        ]

        // Add aroma data sheet if available
        if (exportData.aromaData.length > 0) {
          sheets.push({ name: "Aroma_Popularity", data: exportData.aromaData })
        }

        // Add product data sheet if available
        if (exportData.productData.length > 0) {
          sheets.push({ name: "Product_Performance", data: exportData.productData })
        }

        exportToExcelCSV(sheets, filename)
        break
      default:
        break
    }
  }

  /**
   * Get ApexCharts options for revenue trend chart
   * @returns {Object} ApexCharts configuration options
   */
  const getApexOptions = () => {
    return {
      chart: {
        type: "area",
        height: 350,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      colors: ["#34a887"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100],
        },
      },
      xaxis: {
        categories: analyticsData?.revenueTrendData?.[0]?.data.map((item) => item.x) || [],
        labels: {
          style: {
            colors: "#9e9e9e",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => formatCurrency(val).replace("THB", "K"),
          style: {
            colors: "#9e9e9e",
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val) => formatCurrency(val),
        },
      },
    }
  }

  /**
   * AnalyticsContent component renders the main dashboard content
   * @returns {JSX.Element} The rendered analytics content
   */
  const AnalyticsContent = () => (
    <div className="w-full md:pl-72 pt-32" ref={dashboardRef}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Time Range:</span>
              <select
                className="border rounded-md px-3 py-1 appearance-none bg-white"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="half-year">Last 6 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <div className="relative">
              <button
                data-export-button="true"
                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm"
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              >
                <Download size={16} />
                Export
                <ChevronDown size={14} />
              </button>

              {exportDropdownOpen && (
                <motion.div
                  ref={exportDropdownRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg z-10 border"
                >
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={() => {
                          handleExport("csv")
                          setExportDropdownOpen(false)
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileText size={16} />
                        Export as CSV
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleExport("excel")
                          setExportDropdownOpen(false)
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FileSpreadsheet size={16} />
                        Export as CSV for Excel
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Rest of the component remains unchanged */}
        {/* ... */}
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {["overview", "sales", "customers", "products"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold">
                      {analyticsData ? formatCurrency(analyticsData.totalRevenue) : "Loading..."}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm ${analyticsData?.profitPercentageChange >= 0 ? "text-green-500" : "text-red-500"} flex items-center`}
                  >
                    {analyticsData?.profitPercentageChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(analyticsData?.profitPercentageChange || 0).toFixed(2)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs previous period</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-lg p-6 shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <h3 className="text-2xl font-bold">{analyticsData ? analyticsData.totalOrders : "Loading..."}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-green-500 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    12.5%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs previous period</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white rounded-lg p-6 shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">New Customers</p>
                    <h3 className="text-2xl font-bold">{analyticsData ? analyticsData.newUsers : "Loading..."}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-green-500 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    18.2%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs previous period</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="bg-white rounded-lg p-6 shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Avg. Order Value</p>
                    <h3 className="text-2xl font-bold">
                      {analyticsData
                        ? formatCurrency(analyticsData.totalRevenue / analyticsData.totalOrders)
                        : "Loading..."}
                    </h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-red-500 flex items-center">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    3.1%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs previous period</span>
                </div>
              </motion.div>
            </div>

            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-white rounded-lg p-6 shadow"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Revenue Trend</h2>
                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {getTimeRangeLabel()}
                </div>
              </div>

              <div className="h-80">
                {!loading && analyticsData && analyticsData.revenueTrendData && (
                  <ReactApexChart
                    options={getApexOptions()}
                    series={[
                      {
                        name: "Revenue",
                        data: analyticsData.revenueTrendData[0].data.map((item) => item.y),
                      },
                    ]}
                    type="area"
                    height={320}
                  />
                )}
              </div>
            </motion.div>

            {/* Order Status and Sales Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="bg-white rounded-lg p-6 shadow"
              >
                <h2 className="text-lg font-semibold mb-6">Order Status</h2>
                <div className="h-64">
                  {!loading && analyticsData && (
                    <ResponsivePie
                      data={getOrderStatusData()}
                      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      activeOuterRadiusOffset={8}
                      colors={{ datum: "data.color" }}
                      borderWidth={1}
                      borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                      enableArcLinkLabels={false}
                      arcLabelsSkipAngle={10}
                      arcLabelsTextColor="#ffffff"
                      tooltip={({ datum }) => (
                        <div className="bg-white p-2 shadow rounded border">
                          <strong>{datum.label}</strong>: {datum.value} orders ({datum.percentage}%)
                        </div>
                      )}
                    />
                  )}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {!loading &&
                    analyticsData &&
                    getOrderStatusData().map((status) => (
                      <div key={status.id} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: status.color }}></div>
                        <span className="text-sm">{status.label}</span>
                        <span className="text-sm font-semibold ml-2">{status.percentage}%</span>
                      </div>
                    ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="bg-white rounded-lg p-6 shadow"
              >
                <h2 className="text-lg font-semibold mb-6">
                  {timeRange === "month" ? "Weekly" : timeRange === "quarter" ? "Monthly" : "Monthly"} Sales
                </h2>
                <div className="h-80">
                  {!loading && analyticsData && analyticsData.salesData && (
                    <ResponsiveBar
                      data={analyticsData.salesData}
                      keys={["value"]}
                      indexBy={timeRange === "month" ? "day" : timeRange === "quarter" ? "week" : "month"}
                      margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
                      padding={0.3}
                      valueScale={{ type: "linear" }}
                      colors={["#34a887"]}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Revenue (THB)",
                        legendPosition: "middle",
                        legendOffset: -50,
                      }}
                      labelSkipWidth={12}
                      labelSkipHeight={12}
                      role="application"
                      ariaLabel="Sales chart"
                      tooltip={({ data, value }) => (
                        <div className="bg-white p-2 shadow rounded border">
                          <strong>
                            {data[timeRange === "month" ? "day" : timeRange === "quarter" ? "week" : "month"]}
                          </strong>
                          : {formatCurrency(value)}
                        </div>
                      )}
                    />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Aroma Popularity */}
            {analyticsData?.aromaStats?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="bg-white rounded-lg p-6 shadow"
              >
                <h2 className="text-lg font-semibold mb-6">Aroma Popularity</h2>
                <div className="h-64">
                  <ResponsiveBar
                    data={analyticsData.aromaStats.slice(0, 10)}
                    keys={["count"]}
                    indexBy="name"
                    margin={{ top: 10, right: 10, bottom: 40, left: 120 }}
                    padding={0.3}
                    layout="horizontal"
                    valueScale={{ type: "linear" }}
                    colors={["#0c9df8"]}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Count",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    role="application"
                    ariaLabel="Aroma popularity chart"
                    tooltip={({ data, value }) => (
                      <div className="bg-white p-2 shadow rounded border">
                        <strong>{data.name}</strong>: {value} orders
                      </div>
                    )}
                  />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 shadow"
            >
              <h2 className="text-lg font-semibold mb-6">Daily Orders</h2>
              <div className="h-80">
                {!loading && analyticsData && analyticsData.dailyOrderCounts && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.dailyOrderCounts.slice(-14)} // Last 14 days
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => {
                          const date = new Date(value)
                          return isValid(date) ? format(date, "dd/MM") : value
                        }}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [value, "Orders"]}
                        labelFormatter={(label) => {
                          const date = new Date(label)
                          return isValid(date) ? format(date, "dd MMM yyyy") : label
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} name="Orders" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow"
            >
              <h2 className="text-lg font-semibold mb-6">Revenue Breakdown</h2>
              <div className="h-80">
                {!loading && analyticsData && analyticsData.salesData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey={timeRange === "month" ? "day" : timeRange === "quarter" ? "week" : "month"} />
                      <YAxis
                        tickFormatter={(value) => {
                          return formatCurrency(value).replace("THB", "K")
                        }}
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip formatter={(value) => [formatCurrency(value), "Revenue"]} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 shadow"
            >
              <h2 className="text-lg font-semibold mb-6">New Customers</h2>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600">{analyticsData?.newUsers || 0}</div>
                  <p className="text-gray-500 mt-2">New customers in the selected period</p>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="text-sm text-green-500 flex items-center">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      18.2%
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs previous period</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 shadow"
            >
              <h2 className="text-lg font-semibold mb-6">Top Products</h2>
              <div className="h-80">
                {!loading && analyticsData && analyticsData.productStats && (
                  <ResponsiveBar
                    data={analyticsData.productStats.slice(0, 10)}
                    keys={["count"]}
                    indexBy="name"
                    margin={{ top: 10, right: 10, bottom: 40, left: 120 }}
                    padding={0.3}
                    layout="horizontal"
                    valueScale={{ type: "linear" }}
                    colors={["#ff8d3b"]}
                    axisBottom={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: "Units Sold",
                      legendPosition: "middle",
                      legendOffset: 32,
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    role="application"
                    ariaLabel="Product popularity chart"
                    tooltip={({ data, value }) => (
                      <div className="bg-white p-2 shadow rounded border">
                        <strong>{data.name}</strong>: {value} units sold
                        <br />
                        Revenue: {formatCurrency(data.revenue)}
                      </div>
                    )}
                  />
                )}
              </div>
            </motion.div>

            {/* Product Revenue Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow"
            >
              <h2 className="text-lg font-semibold mb-6">Product Revenue Distribution</h2>
              <div className="h-80">
                {!loading && analyticsData && analyticsData.productStats && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        labelFormatter={(name) => `Product: ${name}`}
                      />
                      <Legend />
                      <Pie
                        data={analyticsData.productStats.slice(0, 5).map((product) => ({
                          name: product.name,
                          value: product.revenue,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.productStats.slice(0, 5).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45 + 120}, 70%, 50%)`} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <ProtectedRoute requiredRoles={[ROLES.OWNER]}>
      {loading && !analyticsData ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
          >
            Try Again
          </button>
        </div>
      ) : (
        <AnalyticsContent />
      )}
    </ProtectedRoute>
  )
}

export default DashboardAnalytics

