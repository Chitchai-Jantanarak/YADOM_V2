"use client"

import { useState, useEffect } from "react"
import { ArrowUpRight, BarChart3, LineChart, PieChart } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

export const ResponsiveApexChart = ({ monthlySales }) => {
  const [chartType, setChartType] = useState("line")
  const [chartWidth, setChartWidth] = useState("100%")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Handle resize for responsiveness
    const handleResize = () => {
      setChartWidth("100%")
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!monthlySales || monthlySales.length === 0 || !mounted) return null

  // Format data for ApexCharts
  const categories = monthlySales.map((item) => item.month)
  const revenueData = monthlySales.map((item) => item.revenue)
  const ordersData = monthlySales.map((item) => item.orders)

  // Chart options
  const options = {
    chart: {
      height: 350,
      type: chartType,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    colors: ["#3b82f6", "#10b981"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: [3, 3],
    },
    title: {
      text: "Monthly Sales Performance",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
    grid: {
      borderColor: "#e0e0e0",
      row: {
        colors: ["#f8f9fa", "transparent"],
        opacity: 0.5,
      },
    },
    markers: {
      size: 4,
    },
    xaxis: {
      categories: categories,
      title: {
        text: "Month",
      },
    },
    yaxis: [
      {
        title: {
          text: "Revenue",
        },
        labels: {
          formatter: (value) => "$" + value.toLocaleString(),
        },
      },
      {
        opposite: true,
        title: {
          text: "Orders",
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value, { seriesIndex }) => {
          if (seriesIndex === 0) {
            return "$" + value.toLocaleString()
          }
          return value
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      floating: true,
      offsetY: -25,
      offsetX: -5,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
            offsetX: 0,
            offsetY: 0,
          },
          yaxis: [
            {
              labels: {
                formatter: (value) => "$" + value / 1000 + "k",
              },
            },
          ],
        },
      },
    ],
  }

  // Series data
  const series = [
    {
      name: "Revenue",
      type: chartType,
      data: revenueData,
    },
    {
      name: "Orders",
      type: chartType,
      data: ordersData,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">Monthly Sales</h2>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded ${chartType === "line" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setChartType("line")}
          >
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Line</span>
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded ${chartType === "bar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setChartType("bar")}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Bar</span>
          </button>
          <button
            className={`flex items-center gap-1 px-3 py-1 rounded ${chartType === "area" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setChartType("area")}
          >
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Area</span>
          </button>
          <button className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">
            <ArrowUpRight className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>
      <div className="h-80">
        {mounted && (
          <ReactApexChart options={options} series={series} type={chartType} height="100%" width={chartWidth} />
        )}
      </div>
    </div>
  )
}

