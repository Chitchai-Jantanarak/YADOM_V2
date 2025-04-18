import { jsPDF } from "jspdf"
import "jspdf-autotable"
import html2canvas from "html2canvas"

// Format date for filenames
const getFormattedDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

// Export data to CSV
export const exportToCSV = (data, filename = "export") => {
  // Convert data to CSV format
  const csvContent = convertToCSV(data)

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  // Create download link and click it
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}_${getFormattedDate()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Convert JSON data to CSV string with Excel-friendly formatting
const convertToCSV = (data, excelFriendly = false) => {
  if (!data || !data.length) return ""

  // Get headers from first object
  const headers = Object.keys(data[0])

  // Create CSV header row
  let csv = headers.join(",") + "\n"

  // Add data rows
  data.forEach((item) => {
    const row = headers
      .map((header) => {
        // Handle special cases (objects, arrays, etc.)
        const value = item[header]

        // Format numbers for Excel if needed
        if (excelFriendly && typeof value === "number") {
          return value.toString()
        }

        // Handle null and undefined
        if (value === null || value === undefined) {
          return ""
        }

        // Handle objects and arrays
        if (typeof value === "object" && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`
        }

        // Handle strings with commas, quotes, or newlines
        if (typeof value === "string") {
          // Excel requires double quotes to be escaped with another double quote
          return `"${value.replace(/"/g, '""')}"`
        }

        // Return other values as is
        return value
      })
      .join(",")
    csv += row + "\n"
  })

  return csv
}

// Enhanced CSV export that works well with Excel
export const exportToExcelCSV = (sheets, filename = "export") => {
  // For multiple sheets, we'll create multiple CSV files
  if (sheets.length > 1) {
    // Create multiple CSV files
    sheets.forEach((sheet) => {
      exportToCSV(sheet.data, `${filename}_${sheet.name}`)
    })

    // Show message to user
    alert("Multiple CSV files have been downloaded. You can open them in Excel.")
    return
  }

  // For a single sheet, just create one CSV file with Excel-friendly formatting
  if (sheets.length === 1) {
    // Create Excel-friendly CSV with BOM for proper character encoding
    const csvContent = convertToCSV(sheets[0].data, true)

    // Create a blob with Excel-friendly encoding
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    // Create download link and click it
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}_${getFormattedDate()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Export data to PDF
export const exportToPDF = (data, filename = "export", title = "Export Data") => {
  try {
    // Create new PDF document
    const doc = new jsPDF("p", "mm", "a4")

    // Add title
    doc.setFontSize(18)
    doc.text(title, 14, 22)
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

    // Get headers and format data for autoTable
    const headers = Object.keys(data[0])
    const rows = data.map((item) =>
      headers.map((header) => {
        const value = item[header]
        return typeof value === "object" && value !== null ? JSON.stringify(value) : value
      }),
    )

    // Manually create a table since autoTable might not be working
    const startY = 40
    const cellPadding = 3
    const cellWidth = 40
    const cellHeight = 10
    const pageWidth = doc.internal.pageSize.width
    const columnsPerPage = Math.floor((pageWidth - 20) / cellWidth)

    // Draw header
    doc.setFillColor(41, 128, 185)
    doc.setTextColor(255, 255, 255)
    doc.setFontStyle("bold")

    for (let i = 0; i < Math.min(headers.length, columnsPerPage); i++) {
      doc.rect(10 + i * cellWidth, startY, cellWidth, cellHeight, "F")
      doc.text(
        headers[i].toString().substring(0, 15),
        10 + i * cellWidth + cellPadding,
        startY + cellHeight - cellPadding,
      )
    }

    // Draw rows
    doc.setFillColor(255, 255, 255)
    doc.setTextColor(0, 0, 0)
    doc.setFontStyle("normal")

    let currentY = startY + cellHeight

    for (let i = 0; i < rows.length; i++) {
      // Check if we need a new page
      if (currentY > doc.internal.pageSize.height - 20) {
        doc.addPage()
        currentY = 20
      }

      for (let j = 0; j < Math.min(rows[i].length, columnsPerPage); j++) {
        const value = rows[i][j]
        const displayValue = value !== null && value !== undefined ? value.toString().substring(0, 15) : ""

        doc.rect(10 + j * cellWidth, currentY, cellWidth, cellHeight)
        doc.text(displayValue, 10 + j * cellWidth + cellPadding, currentY + cellHeight - cellPadding)
      }

      currentY += cellHeight
    }

    // Save PDF
    doc.save(`${filename}_${getFormattedDate()}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Failed to generate PDF. Please try again.")
  }
}

// Export entire dashboard as PDF
export const exportDashboardAsPDF = async (dashboardRef, filename = "dashboard") => {
  if (!dashboardRef.current) return

  try {
    // Show loading indicator
    const loadingEl = document.createElement("div")
    loadingEl.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    loadingEl.innerHTML =
      '<div class="bg-white p-4 rounded-lg shadow-lg"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div><p class="mt-2 text-center">Generating PDF...</p></div>'
    document.body.appendChild(loadingEl)

    // Get the dashboard element
    const element = dashboardRef.current

    // Calculate dimensions to maintain aspect ratio
    const originalWidth = element.offsetWidth
    const originalHeight = element.offsetHeight

    // A4 dimensions in pixels at 96 DPI
    const a4Width = 794 // ~210mm at 96 DPI
    const a4Height = 1123 // ~297mm at 96 DPI

    // Calculate scale to fit content on A4
    const scale = Math.min(a4Width / originalWidth, a4Height / originalHeight) * 0.9

    // Create canvas from the element with modified options to avoid color parsing issues
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: "#ffffff",
      onclone: (document) => {
        // Find and modify elements with oklch colors to use standard RGB
        const elementsWithStyle = document.querySelectorAll('[style*="oklch"]')
        elementsWithStyle.forEach((el) => {
          // Replace oklch colors with a standard color
          el.style.color = "#000000"
          el.style.backgroundColor = "#ffffff"
        })
      },
    })

    // Create PDF
    const pdf = new jsPDF("p", "mm", "a4")

    // Add title
    pdf.setFontSize(16)
    pdf.text("Analytics Dashboard", 105, 15, { align: "center" })
    pdf.setFontSize(10)
    pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" })

    // Calculate dimensions for PDF
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (imgWidth * canvas.height) / canvas.width

    // Add canvas as image
    const imgData = canvas.toDataURL("image/png")
    pdf.addImage(imgData, "PNG", 0, 30, imgWidth, imgHeight)

    // If content exceeds one page, add more pages
    if (imgHeight > 267) {
      // 297mm (A4 height) - 30mm (top margin)
      let currentHeight = 267
      while (currentHeight < imgHeight) {
        pdf.addPage()
        pdf.addImage(
          imgData,
          "PNG",
          0,
          -(currentHeight - 30), // Negative offset to show next part of the image
          imgWidth,
          imgHeight,
        )
        currentHeight += 267
      }
    }

    // Save PDF
    pdf.save(`${filename}_${getFormattedDate()}.pdf`)

    // Remove loading indicator
    document.body.removeChild(loadingEl)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Failed to generate PDF. Please try again.")

    // Remove loading indicator if it exists
    const loadingEl = document.querySelector(".fixed.inset-0.bg-black.bg-opacity-50")
    if (loadingEl) document.body.removeChild(loadingEl)
  }
}

// Prepare analytics data for export
export const prepareAnalyticsDataForExport = (analyticsData, timeRange) => {
  if (!analyticsData) return { summary: [], salesData: [], aromaData: [], productData: [] }

  const { totalRevenue, orderStats, newUsers, salesData, totalOrders, aromaStats, productStats } = analyticsData

  // Prepare summary data
  const summaryData = [
    {
      category: "Time Period",
      value:
        timeRange === "month"
          ? "Last Month"
          : timeRange === "quarter"
            ? "Last Quarter"
            : timeRange === "half-year"
              ? "Last 6 Months"
              : "Last Year",
    },
    { category: "Total Revenue", value: totalRevenue },
    { category: "Total Orders", value: totalOrders },
    { category: "New Users", value: newUsers },
    { category: "Completed Orders", value: orderStats?.completed || 0 },
    { category: "Pending Orders", value: orderStats?.pending || 0 },
    { category: "Waiting Orders", value: orderStats?.waiting || 0 },
    { category: "Confirmed Orders", value: orderStats?.confirmed || 0 },
    { category: "Canceled Orders", value: orderStats?.canceled || 0 },
    { category: "Average Order Value", value: totalOrders > 0 ? totalRevenue / totalOrders : 0 },
  ]

  // Prepare sales data
  const formattedSalesData = salesData
    ? salesData.map((item) => ({
        period: item.day || item.week || item.month || "",
        revenue: item.value || 0,
      }))
    : []

  // Prepare aroma data
  const formattedAromaData = aromaStats
    ? aromaStats.map((aroma) => ({
        name: aroma.name || "",
        count: aroma.count || 0,
      }))
    : []

  // Prepare product data
  const formattedProductData = productStats
    ? productStats.map((product) => ({
        name: product.name || "",
        count: product.count || 0,
        revenue: product.revenue || 0,
      }))
    : []

  return {
    summary: summaryData,
    salesData: formattedSalesData,
    aromaData: formattedAromaData,
    productData: formattedProductData,
  }
}

