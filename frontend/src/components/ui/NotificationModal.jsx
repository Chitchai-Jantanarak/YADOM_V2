"use client"

import { X, CheckCircle, AlertCircle } from "lucide-react"
import { useEffect } from "react"

const NotificationModal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "success", // "success" or "error"
  actionButton = null,
  autoClose = false,
  autoCloseTime = 3000,
}) => {
  useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseTime)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose, autoClose, autoCloseTime])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative border border-white/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          {type === "success" ? (
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          ) : (
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
          )}

          <h2 className="text-2xl font-bold mb-3">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          {actionButton ? (
            actionButton
          ) : (
            <button
              onClick={onClose}
              className={`px-8 py-3 rounded-full hover:opacity-90 transition-all shadow-md text-white ${
                type === "success"
                  ? "bg-gradient-to-r from-green-400 to-green-500"
                  : "bg-gradient-to-r from-red-400 to-red-500"
              }`}
            >
              {type === "success" ? "Continue" : "Try Again"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationModal

