"use client"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { addToHistory } from "../../utils/navigationHistory"

/**
 * Component that tracks navigation history
 * Place this at the root of your app
 */
const HistoryTracker = () => {
  const location = useLocation()

  useEffect(() => {
    // Add current path to history
    addToHistory(location.pathname)
  }, [location])

  // This component doesn't render anything
  return null
}

export default HistoryTracker

