"use client"

import { useState, useEffect } from "react"
import { handleImageError } from "../../utils/imageUtils"

// Different QR code providers for fallback
const QR_PROVIDERS = [
  (data) => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`,
  (data) => `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(data)}`,
]

const PaymentQRCode = ({ orderId, amount, currency = "THB", paymentProvider = "default", size = 200 }) => {
  const [qrUrl, setQrUrl] = useState("")
  const [fallbackIndex, setFallbackIndex] = useState(0)

  // Generate payment data string based on provider
  const getPaymentData = () => {
    switch (paymentProvider) {
      case "promptpay":
        // PromptPay format (Thailand)
        return `promptpay|${orderId}|${amount}|${currency}`
      case "paynow":
        // PayNow format (Singapore)
        return `paynow|${orderId}|${amount}|${currency}`
      default:
        // Generic format
        return `Payment for Order ${orderId} Amount ${amount} ${currency}`
    }
  }

  useEffect(() => {
    const paymentData = getPaymentData()
    setQrUrl(QR_PROVIDERS[fallbackIndex](paymentData))
  }, [orderId, amount, currency, paymentProvider, fallbackIndex])

  const handleError = () => {
    // Try next provider if available
    if (fallbackIndex < QR_PROVIDERS.length - 1) {
      setFallbackIndex(fallbackIndex + 1)
    } else {
      // If all providers fail, use handleImageError
      const img = document.getElementById(`qr-${orderId}`)
      if (img) {
        handleImageError({ target: img }, "qrcode")
      }
    }
  }

  return (
    <div className="flex items-center justify-center">
      <img
        id={`qr-${orderId}`}
        src={qrUrl || "/placeholder.svg"}
        alt={`Payment QR Code for order #${orderId}`}
        width={size}
        height={size}
        className="object-contain"
        onError={handleError}
      />
    </div>
  )
}

export default PaymentQRCode

