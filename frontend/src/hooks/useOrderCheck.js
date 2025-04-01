"use client"

import { useState, useEffect } from "react"
import { getUserOrders } from "../services/orderService"
import { isAuthenticated } from "../services/authService"

export const useOrderCheck = () => {
  const [hasPendingOrder, setHasPendingOrder] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkPendingOrders = async () => {
      try {
        // Only check if user is authenticated
        if (!isAuthenticated()) {
          setIsChecking(false)
          return
        }

        setIsChecking(true)
        const response = await getUserOrders()

        // Check if there are any orders with WAITING status
        const pendingOrder = response.orders.find((order) => order.status === "WAITING" && !order.deletedAt)

        if (pendingOrder) {
          setHasPendingOrder(true)
          setPendingOrderId(pendingOrder.id)
        } else {
          setHasPendingOrder(false)
          setPendingOrderId(null)
        }
      } catch (error) {
        console.error("Error checking pending orders:", error)
      } finally {
        setIsChecking(false)
      }
    }

    checkPendingOrders()
  }, [])

  return { hasPendingOrder, pendingOrderId, isChecking }
}

