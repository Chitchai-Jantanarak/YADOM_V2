"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Function to check if the device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera

      // Check if device width is less than 768px (typical tablet/mobile breakpoint)
      const isSmallScreen = window.innerWidth < 768

      // Check common mobile user agent patterns
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      const isMobileDevice = mobileRegex.test(userAgent)

      // Consider it mobile if either condition is true
      setIsMobile(isSmallScreen || isMobileDevice)
    }

    // Check on mount
    checkMobile()

    // Check on resize
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return isMobile
}

